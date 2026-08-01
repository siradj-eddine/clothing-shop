from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
import logging
from .serializers import ContactSerializer

logger = logging.getLogger(__name__)


class ContactView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = ContactSerializer(data=request.data)

        if not serializer.is_valid():
            logger.warning(f"Contact form validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        if not settings.BREVO_API_KEY:
            logger.error("BREVO_API_KEY is not set in environment")
            return Response(
                {'error': 'Email service not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json"
        }

        admin_email = {
            "sender": {"name": "Brothers Shop", "email": "siradjboulemaiz@gmail.com"},
            "to": [{"email": "siradjboulemaiz@gmail.com"}],
            "subject": f"Contact Form: {data['subject']}",
            "htmlContent": f"""
            <!DOCTYPE html><html><body>
                <h2>New Contact Message</h2>
                <p><strong>Name:</strong> {data['name']}</p>
                <p><strong>Email:</strong> {data['email']}</p>
                <p><strong>Subject:</strong> {data['subject']}</p>
                <p><strong>Message:</strong></p>
                <p>{data['message']}</p>
            </body></html>
            """
        }

        customer_email = {
            "sender": {"name": "Brothers Shop", "email": "siradjboulemaiz@gmail.com"},
            "to": [{"email": data['email']}],
            "subject": "Thank you for contacting Brothers Shop",
            "htmlContent": f"""
            <!DOCTYPE html><html><body>
                <h2>Thank you for contacting us!</h2>
                <p>Dear {data['name']},</p>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <br>
                <p>Best regards,<br>Brothers Shop Team</p>
            </body></html>
            """
        }

        # --- Send admin notification ---
        try:
            response_admin = requests.post(url, json=admin_email, headers=headers, timeout=10)
            logger.info(f"Brevo admin response: {response_admin.status_code} - {response_admin.text}")
        except requests.exceptions.ConnectionError as e:
            logger.error(f"Brevo CONNECTION ERROR (admin email): {e}")
            return Response(
                {'error': 'Could not connect to email service', 'detail': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except requests.exceptions.Timeout as e:
            logger.error(f"Brevo TIMEOUT (admin email): {e}")
            return Response(
                {'error': 'Email service timed out', 'detail': str(e)},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Brevo REQUEST ERROR (admin email): {type(e).__name__} - {e}")
            return Response(
                {'error': 'Email request failed', 'detail': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # --- Send customer auto-reply ---
        try:
            response_customer = requests.post(url, json=customer_email, headers=headers, timeout=10)
            logger.info(f"Brevo customer response: {response_customer.status_code} - {response_customer.text}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Brevo REQUEST ERROR (customer email): {type(e).__name__} - {e}")
            return Response(
                {'error': 'Customer email failed', 'detail': str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )

        # --- Evaluate Brevo's actual responses ---
        if response_admin.status_code == 201 and response_customer.status_code == 201:
            return Response({'message': 'Message sent successfully!'}, status=status.HTTP_200_OK)

        logger.error(
            f"Brevo rejected email. Admin: {response_admin.status_code} {response_admin.text} | "
            f"Customer: {response_customer.status_code} {response_customer.text}"
        )
        return Response(
            {
                'error': 'Failed to send email',
                'admin_status': response_admin.status_code,
                'admin_detail': response_admin.text,
                'customer_status': response_customer.status_code,
                'customer_detail': response_customer.text,
            },
            status=status.HTTP_400_BAD_REQUEST
        )