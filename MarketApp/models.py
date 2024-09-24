from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название категории")
    parent = models.ForeignKey(
        'self',  # ссылка на саму модель Category
        on_delete=models.CASCADE,  # при удалении родительской категории удаляются все её подкатегории
        null=True,  # позволяет категориям быть верхнего уровня (без родителя)
        blank=True,  # позволяет не указывать родителя (для категорий верхнего уровня)
        related_name='subcategories',  # для доступа к подкатегориям через обратную связь
        verbose_name="Родительская категория"
    )
    photo_url = models.URLField(verbose_name="Ссылка на фото", max_length=255)

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name
