from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
from .serializers import ContactSerializer

class ContactView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data

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

            try:
                response_admin = requests.post(url, json=admin_email, headers=headers)
                response_customer = requests.post(url, json=customer_email, headers=headers)

                if response_admin.status_code == 201 and response_customer.status_code == 201:
                    return Response({'message': 'Message sent successfully!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Failed to send email'}, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)