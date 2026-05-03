# property/permissions.py
from rest_framework import permissions

class IsAllowedToAddProperty(permissions.BasePermission):
    """
    Allow only admin, developer, broker, or agent to add a property.
    Deny buyers and unauthenticated users.
    """
    
    message = "Only admins, developers, brokers, and agents can add properties."

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            self.message = "Authentication required."
            return False
        allowed_roles = ["admin", "developer", "broker", "agent"]
        return user.role in allowed_roles
