import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { Skill } from "@create-resume/shared-types";

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const skillLevels = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "expert", label: "Expert" },
] as const;

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });

  const addSkill = () => {
    if (!newSkill.name.trim()) return;

    const skill: Skill = {
      id: crypto.randomUUID(),
      name: newSkill.name.trim(),
      category: newSkill.category.trim() || undefined,
      level: "intermediate",
    };

    onChange([...skills, skill]);
    setNewSkill({ name: "", category: "" });
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const updateSkillLevel = (id: string, level: Skill["level"]) => {
    onChange(
      skills.map((s) => (s.id === id ? { ...s, level } : s))
    );
  };

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "Outras";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Habilidades</h3>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label>Nome da Habilidade</Label>
          <Input
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="React, Python, Gestão de Projetos..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
        </div>
        <div className="w-40 space-y-2">
          <Label>Categoria</Label>
          <Input
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
            placeholder="Frontend"
          />
        </div>
        <div className="flex items-end">
          <Button type="button" onClick={addSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {skills.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma habilidade adicionada
        </p>
      )}

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {category}
          </h4>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full"
              >
                <span className="text-sm">{skill.name}</span>
                <select
                  value={skill.level || "intermediate"}
                  onChange={(e) =>
                    updateSkillLevel(skill.id, e.target.value as Skill["level"])
                  }
                  className="text-xs bg-transparent border-none focus:ring-0"
                >
                  {skillLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
