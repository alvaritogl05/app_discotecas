import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { Input, Toggle } from "@/components/ui/Form";
import { EmptyState, ErrorState, Badge } from "@/components/ui/Layout";

describe("Button", () => {
  it("renderiza el texto y dispara onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Guardar</Button>);
    await userEvent.click(screen.getByRole("button", { name: /guardar/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("queda deshabilitado mientras carga", () => {
    render(
      <Button loading disabled>
        Enviar
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });
});

describe("Input accesible", () => {
  it("asocia label y muestra el error con role=alert", () => {
    render(<Input label="Nombre" error="Este campo es obligatorio" />);
    const input = screen.getByLabelText("Nombre");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Este campo es obligatorio");
  });

  it("no muestra error cuando es válido", () => {
    render(<Input label="Teléfono" hint="Formato internacional" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Formato internacional")).toBeInTheDocument();
  });
});

describe("Toggle accesible", () => {
  it("usa role=switch con aria-checked y alterna al pulsar", async () => {
    const onChange = vi.fn();
    render(<Toggle label="Compartir mis planes" checked={false} onChange={onChange} />);
    const toggle = screen.getByRole("switch", { name: "Compartir mis planes" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Estados de interfaz", () => {
  it("EmptyState ofrece acción cuando se indica", () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="Prueba con otro filtro."
        action={{ href: "/explorar", label: "Ver explorar" }}
      />,
    );
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver explorar/i })).toHaveAttribute("href", "/explorar");
  });

  it("ErrorState expone role=alert", () => {
    render(<ErrorState description="No se han podido cargar los datos." />);
    expect(screen.getByRole("alert")).toHaveTextContent("No se han podido cargar los datos.");
  });

  it("Badge muestra el texto", () => {
    render(<Badge tone="success">Verificado</Badge>);
    expect(screen.getByText("Verificado")).toBeInTheDocument();
  });
});
