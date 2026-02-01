import type { Skill } from "@create-resume/shared-types";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface SortableSkillItemProps {
	skill: Skill;
	updateSkillLevel: (id: string, level: Skill["level"]) => void;
	removeSkill: (id: string) => void;
}

function SortableSkillItem({
	skill,
	updateSkillLevel,
	removeSkill,
}: SortableSkillItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: skill.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}
		>
			<button
				type="button"
				className="cursor-grab active:cursor-grabbing hover:bg-background/50 rounded touch-none"
				{...attributes}
				{...listeners}
			>
				<GripVertical className="h-4 w-4 text-muted-foreground" />
			</button>
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
	);
}

export function SkillsForm({ skills, onChange }: SkillsFormProps) {
	const [newSkill, setNewSkill] = useState({ name: "", category: "" });

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

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
		onChange(skills.map((s) => (s.id === id ? { ...s, level } : s)));
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = skills.findIndex((s) => s.id === active.id);
			const newIndex = skills.findIndex((s) => s.id === over.id);
			onChange(arrayMove(skills, oldIndex, newIndex));
		}
	};

	const groupedSkills = skills.reduce(
		(acc, skill) => {
			const category = skill.category || "Outras";
			if (!acc[category]) acc[category] = [];
			acc[category].push(skill);
			return acc;
		},
		{} as Record<string, Skill[]>,
	);

	return (
		<div className="space-y-4">
			<div>
				<h3 className="font-semibold text-lg">Habilidades</h3>
				{skills.length > 1 && (
					<p className="text-xs text-muted-foreground">
						Arraste para reordenar
					</p>
				)}
			</div>

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

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={skills.map((s) => s.id)}
					strategy={verticalListSortingStrategy}
				>
					{Object.entries(groupedSkills).map(([category, categorySkills]) => (
						<div key={category} className="space-y-2">
							<h4 className="text-sm font-medium text-muted-foreground">
								{category}
							</h4>
							<div className="flex flex-wrap gap-2">
								{categorySkills.map((skill) => (
									<SortableSkillItem
										key={skill.id}
										skill={skill}
										updateSkillLevel={updateSkillLevel}
										removeSkill={removeSkill}
									/>
								))}
							</div>
						</div>
					))}
				</SortableContext>
			</DndContext>
		</div>
	);
}
