import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "../components/ResumePreview";
import { useResume } from "../hooks/useResume";
import { useDeleteResume } from "../hooks/useDeleteResume";
import { ROUTES_PATH, buildRoute } from "@create-resume/routes";
import { ArrowLeft, Edit, Trash2, Download, Loader2 } from "lucide-react";

export function ResumeViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resume, isLoading, error } = useResume(id!);
  const { mutate: deleteResume, isPending: isDeleting } = useDeleteResume();

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este currículo?")) {
      deleteResume(id!);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-4">
        <p className="text-muted-foreground">Currículo não encontrado</p>
        <Button variant="outline" asChild>
          <Link to={ROUTES_PATH.DASHBOARD}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES_PATH.DASHBOARD}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {resume.personalInfo.fullName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {resume.personalInfo.email}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Download className="h-4 w-4 mr-2" />
            Imprimir / PDF
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={buildRoute.resumeEdit(id!)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center">
        <div className="w-[210mm] shadow-lg print:shadow-none">
          <ResumePreview data={resume} />
        </div>
      </div>
    </div>
  );
}
