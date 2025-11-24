from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services.importador import importar_imagen


class EscanearView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Recibe una ruta local absoluta en el backend.
        Escanea → sube a Cloudinary → crea producto.
        """

        ruta = request.data.get("ruta")
        if not ruta:
            return Response({"error": "Falta ruta"}, status=400)

        producto = importar_imagen(ruta)

        if producto:
            return Response({"status": "ok", "producto": producto.id})
        else:
            return Response({"status": "duplicado"}, status=200)
