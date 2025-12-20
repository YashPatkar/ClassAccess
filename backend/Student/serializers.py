from rest_framework import serializers

class StudentAccessSerializer(serializers.Serializer):
    code = serializers.CharField()
