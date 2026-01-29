import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import type { Experience } from "@create-resume/shared-types";

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

const emptyExperience: Omit<Experience, "id"> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  highlights: [],
};

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const [highlightInput, setHighlightInput] = useState<Record<string, string>>(
    {}
  );

  const addExperience = () => {
    const newExp: Experience = {
      ...emptyExperience,
      id: crypto.randomUUID(),
    };
    onChange([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string | boolean | string[]
  ) => {
    onChange(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const addHighlight = (id: string) => {
    const text = highlightInput[id]?.trim();
    if (!text) return;

    const exp = experiences.find((e) => e.id === id);
    if (exp) {
      updateExperience(id, "highlights", [...exp.highlights, text]);
      setHighlightInput({ ...highlightInput, [id]: "" });
    }
  };

  const removeHighlight = (expId: string, index: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (exp) {
      updateExperience(
        expId,
        "highlights",
        exp.highlights.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Experiência Profissional</h3>
        <Button type="button" variant="outline" size="sm" onClick={addExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {experiences.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma experiência adicionada
        </p>
      )}

      {experiences.map((exp, index) => (
        <div key={exp.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Experiência {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Empresa *</Label>
              <Input
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp.id, "company", e.target.value)
                }
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Input
                value={exp.position}
                onChange={(e) =>
                  updateExperience(exp.id, "position", e.target.value)
                }
                placeholder="Desenvolvedor Full Stack"
              />
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(exp.id, "startDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="month"
                value={exp.endDate || ""}
                onChange={(e) =>
                  updateExperience(exp.id, "endDate", e.target.value)
                }
                disabled={exp.current}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    updateExperience(exp.id, "current", e.target.checked)
                  }
                />
                Trabalho atual
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp.id, "description", e.target.value)
              }
              placeholder="Descreva suas responsabilidades..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Destaques</Label>
            <div className="flex gap-2">
              <Input
                value={highlightInput[exp.id] || ""}
                onChange={(e) =>
                  setHighlightInput({ ...highlightInput, [exp.id]: e.target.value })
                }
                placeholder="Adicione uma conquista ou responsabilidade"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight(exp.id);
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => addHighlight(exp.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {exp.highlights.length > 0 && (
              <ul className="space-y-1 mt-2">
                {exp.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded"
                  >
                    <span className="flex-1">{h}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(exp.id, i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
