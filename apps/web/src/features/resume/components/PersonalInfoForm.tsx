import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PersonalInfo } from "@create-resume/shared-types";

interface PersonalInfoFormProps {
  data: Partial<PersonalInfo>;
  summary: string;
  onChange: (data: Partial<PersonalInfo>) => void;
  onSummaryChange: (summary: string) => void;
}

export function PersonalInfoForm({
  data,
  summary,
  onChange,
  onSummaryChange,
}: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Informações Pessoais</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo *</Label>
          <Input
            id="fullName"
            value={data.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="João da Silva"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="joao@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input
            id="location"
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="São Paulo, SP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn</Label>
          <Input
            id="linkedIn"
            value={data.linkedIn || ""}
            onChange={(e) => handleChange("linkedIn", e.target.value)}
            placeholder="https://linkedin.com/in/seu-perfil"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/seu-usuario"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Resumo Profissional</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Breve descrição sobre sua experiência e objetivos profissionais..."
          rows={4}
        />
      </div>
    </div>
  );
}
