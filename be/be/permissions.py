from rest_framework.response import Response
from rest_framework import status

'''
    Usage:
    @permissions([
        IsAuthenticated,
        IsAdminUser,
    ], OtherPermission)

    Use array for combination of permissions
'''
def permissions(*permissions_combinations):
    def decorator(func):
        def wrap(self, request, *args, **kwargs):
            has_permission = []
            for perm in permissions_combinations:
                if type(perm) == list:
                    check_permission = []
                    for p in perm:
                        if p.has_permission(self, request, self):
                            check_permission.append(True)
                    if len(check_permission) == len(perm):
                        has_permission.append(True)
                else: 
                    if perm.has_permission(self, request, self):
                        has_permission.append(True)

            if len(has_permission) <= 0:
                return Response(
                    { 
                        'error': 'You do not have permission to perform this action.'
                    }, 
                    status=status.HTTP_403_FORBIDDEN
                )

            return func(self, request, *args, **kwargs)
        return wrap
    return decorator