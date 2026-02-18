from django.db import models

class Section(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Topic(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Question(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions')
    title = models.CharField(max_length=255)
    description = models.TextField()
    solution = models.TextField()
    logic_explanation = models.TextField()

    def __str__(self):
        return self.title
