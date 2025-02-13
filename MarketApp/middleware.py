from django.http import HttpResponseForbidden

class RestrictDirectAccessMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.headers['Sec-Fetch-Dest'] != 'empty' and not (request.path.startswith('/admin/') or request.path == '/index/'):
            return HttpResponseForbidden("Прямой доступ запрещён")
        return self.get_response(request)
