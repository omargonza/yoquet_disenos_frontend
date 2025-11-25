from django.urls import path
from .views_api import EscanearView
from .views_api import PendientesView  

urlpatterns = [
    path("escanear/", EscanearView.as_view()),
    path("pendientes/", PendientesView.as_view()),
]
