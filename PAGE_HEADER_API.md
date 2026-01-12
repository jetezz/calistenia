# PageHeader Component - Nueva API

## Resumen de Cambios

El componente `PageHeader` ahora soporta control explícito sobre la ubicación de los botones mediante las props `topActions` y `bottomActions`.

## Nuevas Props

### `topActions` (ReactNode)

Botones que se muestran en la **fila superior**, a la derecha del título. Estos botones siempre intentan mantenerse en la misma línea que el título.

### `bottomActions` (ReactNode)

Botones que se muestran en la **fila inferior**, siempre alineados a la derecha. Estos botones siempre aparecen en una nueva línea debajo del título.

## Layout Visual

```
┌─────────────────────────────────────────────────────┐
│ [Icon] Título              [TopAction1] [TopAction2]│
│                                   [BottomAction1]    │
└─────────────────────────────────────────────────────┘
```

## Ejemplo de Uso

```tsx
<StandardPage
  icon={Activity}
  title="Estadísticas"
  description="Seguimiento de tu composición corporal"
  topActions={
    <>
      <Button onClick={handleRefresh} variant="outline" size="sm">
        <RefreshCw className="size-4" />
      </Button>
      <Button onClick={handleConfig} variant="outline" size="sm">
        <Settings2 className="mr-1 size-4" />
        Configurar
      </Button>
    </>
  }
  bottomActions={
    <Button onClick={handleNew} size="sm">
      <Plus className="mr-1 size-4" />
      Nueva
    </Button>
  }
>
  {/* Contenido de la página */}
</StandardPage>
```

## Compatibilidad hacia atrás

Las props antiguas (`onRefresh` y `actionButton`) siguen funcionando pero están marcadas como deprecated. Se recomienda migrar al nuevo API usando `topActions` y `bottomActions`.

### Migración

**Antes:**

```tsx
<StandardPage
  onRefresh={refreshData}
  actionButton={
    <div className="flex gap-2">
      <Button>Configurar</Button>
      <Button>Nueva</Button>
    </div>
  }
/>
```

**Después:**

```tsx
<StandardPage
  topActions={
    <>
      <Button onClick={refreshData} variant="outline" size="sm">
        <RefreshCw className="size-4" />
      </Button>
      <Button>Configurar</Button>
    </>
  }
  bottomActions={<Button>Nueva</Button>}
/>
```

## Ventajas

1. **Control explícito**: Decides exactamente qué botones van arriba y cuáles abajo
2. **Responsive**: Los botones superiores se mantienen en línea con el título cuando hay espacio
3. **Alineación consistente**: Todos los botones siempre se alinean a la derecha
4. **Flexibilidad**: Puedes poner múltiples botones en cualquiera de las filas
