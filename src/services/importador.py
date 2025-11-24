import os
import cloudinary.uploader
from productos.models import Producto, Categoria


def importar_imagen(path_local):
    """
    Importa una imagen local → la sube a Cloudinary → crea o actualiza un producto.
    """

    # Ej: productos/fibrofacil/catalogo-x.webp
    partes = os.path.normpath(path_local).split(os.sep)

    # Nombre de la categoría = carpeta
    try:
        categoria_nombre = partes[-2]
    except:
        categoria_nombre = "sin_categoria"

    categoria, _ = Categoria.objects.get_or_create(nombre=categoria_nombre)

    # Subir a Cloudinary
    upload = cloudinary.uploader.upload(
        path_local,
        folder=f"yoquet/productos/{categoria_nombre}",
        resource_type="image"
    )

    url = upload.get("secure_url")
    public_id = upload.get("public_id").split("/")[-1]

    # Nombre automático del producto
    nombre_generado = f"{categoria_nombre.capitalize()} {public_id}"

    # Verificar si ya existe (evita duplicados)
    if Producto.objects.filter(imagen=url).exists():
        return None

    producto = Producto.objects.create(
        categoria=categoria,
        nombre=nombre_generado,
        descripcion="Producto auto-importado",
        precio=0,
        stock=1,
        destacado=False,
        imagen=url
    )

    return producto
