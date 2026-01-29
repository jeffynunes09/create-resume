import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { Education } from "@create-resume/shared-types";

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const emptyEducation: Omit<Education, "id"> = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  current: false,
  gpa: "",
};

export function EducationForm({ education, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEdu: Education = {
      ...emptyEducation,
      id: crypto.randomUUID(),
    };
    onChange([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string | boolean
  ) => {
    onChange(
      education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Educação</h3>
        <Button type="button" variant="outline" size="sm" onClick={addEducation}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {education.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma formação adicionada
        </p>
      )}

      {education.map((edu, index) => (
        <div key={edu.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Formação {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instituição *</Label>
              <Input
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, "institution", e.target.value)
                }
                placeholder="Universidade de São Paulo"
              />
            </div>

            <div className="space-y-2">
              <Label>Grau *</Label>
              <Input
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, "degree", e.target.value)
                }
                placeholder="Bacharelado"
              />
            </div>

            <div className="space-y-2">
              <Label>Área *</Label>
              <Input
                value={edu.field}
                onChange={(e) =>
                  updateEducation(edu.id, "field", e.target.value)
                }
                placeholder="Ciência da Computação"
              />
            </div>

            <div className="space-y-2">
              <Label>Coeficiente (CR/GPA)</Label>
              <Input
                value={edu.gpa || ""}
                onChange={(e) =>
                  updateEducation(edu.id, "gpa", e.target.value)
                }
                placeholder="8.5"
              />
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) =>
                  updateEducation(edu.id, "startDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="month"
                value={edu.endDate || ""}
                onChange={(e) =>
                  updateEducation(edu.id, "endDate", e.target.value)
                }
                disabled={edu.current}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) =>
                    updateEducation(edu.id, "current", e.target.checked)
                  }
                />
                Cursando
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
