
import subprocess
import tempfile
import os
import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import Section, Topic, Question

def home(request):
    return render(request, "index.html")

def section_page(request):
    return render(request, "section.html")

def topic_page(request):
    return render(request, "topic.html")

def get_sections(request):
    sections = list(Section.objects.values())
    return JsonResponse(sections, safe=False)

def get_topics(request, section_id):
    topics = list(Topic.objects.filter(section_id=section_id).values())
    return JsonResponse(topics, safe=False)

def get_questions(request, topic_id):
    questions = list(Question.objects.filter(topic_id=topic_id).values())
    return JsonResponse(questions, safe=False)

@csrf_exempt
def run_java(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            code = body.get("code", "")

            # Save code to temporary directory
            with tempfile.TemporaryDirectory() as tmpdir:
                java_file = os.path.join(tmpdir, "Main.java")
                with open(java_file, "w") as f:
                    f.write(code)

                # Compile Java
                compile_proc = subprocess.run(
                    ["javac", java_file],
                    capture_output=True,
                    text=True
                )

                if compile_proc.returncode != 0:
                    return JsonResponse({"output": compile_proc.stderr})

                # Run Java
                run_proc = subprocess.run(
                    ["java", "-cp", tmpdir, "Main"],
                    capture_output=True,
                    text=True
                )

                return JsonResponse({"output": run_proc.stdout or run_proc.stderr})
        except Exception as e:
            return JsonResponse({"output": str(e)})
            
    return JsonResponse({"output": "Invalid request method"})
