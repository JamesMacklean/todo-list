from django.db import models

class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    due_date = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(
        max_length=10,
        choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')],
        default='Medium'
    )
    category = models.CharField(max_length=100, blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    def __str__(self):
        return self.name
