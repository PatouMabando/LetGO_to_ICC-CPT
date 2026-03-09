from django.core.management.base import BaseCommand

from accounts.models import User

ADMINS = [
    {
        "name": "Mehdi",
        "last_name": "Kiona",
        "phone_number": "+27659546977",
        "role": "admin",
        "status": "approved",
    },
    # Add more admin dicts here as needed
]


class Command(BaseCommand):
    help = "Create initial admin users if they don't already exist"

    def handle(self, *args, **options):
        for admin_data in ADMINS:
            phone = admin_data["phone_number"]
            if User.objects.filter(phone_number=phone).exists():
                self.stdout.write(f"Admin with phone {phone} already exists.")
            else:
                User.objects.create_user(**admin_data)
                self.stdout.write(self.style.SUCCESS(f"Admin user {phone} created!"))
