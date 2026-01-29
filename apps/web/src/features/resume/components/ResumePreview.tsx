import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import type { Resume } from "@create-resume/shared-types";

interface ResumePreviewProps {
  data: Partial<Resume>;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { personalInfo, summary, experiences, education, skills } = data;

  const formatDate = (date?: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="bg-white text-black p-8 shadow-lg min-h-[842px] text-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {personalInfo?.fullName || "Seu Nome"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-xs">
          {personalInfo?.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo?.linkedIn && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              LinkedIn
            </span>
          )}
          {personalInfo?.github && (
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3" />
              GitHub
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <>
          <Separator className="my-4" />
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2">
              Resumo
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        </>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <>
          <Separator className="my-4" />
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3">
              Experiência Profissional
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.current ? "Presente" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-1 text-xs">{exp.description}</p>
                  )}
                  {exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-1 text-xs text-gray-700">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <>
          <Separator className="my-4" />
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3">
              Educação
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {edu.degree} em {edu.field}
                    </h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500">CR: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(edu.startDate)} -{" "}
                    {edu.current ? "Presente" : formatDate(edu.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <>
          <Separator className="my-4" />
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2">
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
