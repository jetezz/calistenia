import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisibilityToggle } from "./VisibilityToggle";
import type { Testimonial } from "@/types/branding";

interface TestimonialEditorProps {
  testimonials: Testimonial[];
  onChange: (testimonials: Testimonial[]) => void;
  disabled?: boolean;
}

export function TestimonialEditor({
  testimonials,
  onChange,
  disabled = false,
}: TestimonialEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      text: "",
      visible: true,
    };
    onChange([...testimonials, newTestimonial]);
    setEditingId(newTestimonial.id);
  };

  const handleUpdate = (id: string, updates: Partial<Testimonial>) => {
    onChange(testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleRemove = (id: string) => {
    onChange(testimonials.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleToggleVisibility = (id: string, visible: boolean) => {
    handleUpdate(id, { visible });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Testimonios</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled}
        >
          <Plus className="size-4 mr-2" />
          Añadir Testimonio
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay testimonios. Haz clic en "Añadir Testimonio" para crear uno.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      Testimonio {index + 1}
                    </CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(testimonial.id)}
                    disabled={disabled}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`testimonial-name-${testimonial.id}`}>
                      Nombre
                    </Label>
                    <Input
                      id={`testimonial-name-${testimonial.id}`}
                      value={testimonial.name}
                      onChange={(e) =>
                        handleUpdate(testimonial.id, { name: e.target.value })
                      }
                      placeholder="Ej: María, 47 años"
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`testimonial-role-${testimonial.id}`}>
                      Profesión/Rol
                    </Label>
                    <Input
                      id={`testimonial-role-${testimonial.id}`}
                      value={testimonial.role}
                      onChange={(e) =>
                        handleUpdate(testimonial.id, { role: e.target.value })
                      }
                      placeholder="Ej: Funcionaria pública"
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`testimonial-text-${testimonial.id}`}>
                    Testimonio
                  </Label>
                  <Textarea
                    id={`testimonial-text-${testimonial.id}`}
                    value={testimonial.text}
                    onChange={(e) =>
                      handleUpdate(testimonial.id, { text: e.target.value })
                    }
                    placeholder="Escribe el testimonio del cliente..."
                    rows={3}
                    disabled={disabled}
                  />
                </div>

                <VisibilityToggle
                  label="Mostrar este testimonio"
                  checked={testimonial.visible}
                  onCheckedChange={(checked) =>
                    handleToggleVisibility(testimonial.id, checked)
                  }
                  disabled={disabled}
                  description="Controla si este testimonio aparece en la landing page"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Los testimonios aparecerán en la landing page en el orden mostrado aquí.
      </p>
    </div>
  );
}
