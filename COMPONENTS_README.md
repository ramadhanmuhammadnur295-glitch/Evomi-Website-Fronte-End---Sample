# Global Components — Evomi Frontend

Komponen-komponen global yang siap pakai untuk project Next.js Evomi.

## Setup

### 1. Install dependencies yang dibutuhkan

```bash
npm install clsx tailwind-merge
```

> `framer-motion`, `lucide-react`, `next-themes` sudah ada di `package.json` kamu.

### 2. Tambahkan `lib/utils.ts`

Salin file `lib/utils.ts` ke root project kamu. File ini berisi helper `cn()` untuk Tailwind class merging.

### 3. Tambahkan ToastProvider ke layout

Edit `app/layout.tsx`:

```tsx
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Komponen

### `<Navbar />`
Navbar responsif dengan dark mode, active link indicator, dan mobile menu.

```tsx
import Navbar from "@/components/Navbar";

// Letakkan di layout.tsx
<Navbar />
```

---

### `<Footer />`
Footer dengan kolom links, social icons, dan copyright.

```tsx
import Footer from "@/components/Footer";

<Footer />
```

---

### `<Button />`

```tsx
import Button from "@/components/Button";

// Variants: primary | secondary | outline | ghost | danger
// Sizes: sm | md | lg

<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" isLoading>Loading...</Button>
<Button as="link" href="/about">Go to About</Button>
<Button variant="primary" leftIcon={<PlusIcon />}>Add Item</Button>
```

---

### `<Card />`

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/Card";

<Card variant="default" padding="md" hover>
  <CardHeader>
    <CardTitle>Judul Card</CardTitle>
    <CardDescription>Deskripsi singkat di sini.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Konten utama card.</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Action</Button>
  </CardFooter>
</Card>
```

Variants: `default` | `bordered` | `elevated` | `ghost`

---

### `<Section />` & `<SectionHeader />`

```tsx
import { Section, SectionHeader } from "@/components/Section";

<Section>
  <SectionHeader
    badge="New"
    title="Judul Section"
    description="Deskripsi lebih panjang tentang section ini."
    align="center"
  />
  {/* konten section */}
</Section>
```

---

### `<Modal />`

```tsx
import Modal from "@/components/Modal";
import { useState } from "react";

const [open, setOpen] = useState(false);

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Konfirmasi"
  description="Apakah kamu yakin?"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
      <Button variant="danger">Hapus</Button>
    </>
  }
>
  <p>Konten modal di sini.</p>
</Modal>
```

Sizes: `sm` | `md` | `lg` | `xl` | `full`

---

### `<Spinner />`, `<PageLoader />`, `<Skeleton />`

```tsx
import { Spinner, PageLoader, Skeleton, SkeletonCard } from "@/components/Spinner";

<Spinner size="md" variant="primary" />
<Spinner size="sm" variant="white" label="Loading data..." />

<PageLoader label="Memuat halaman..." />

<Skeleton className="h-4 w-32" />
<SkeletonCard lines={3} />
```

---

### Toast / Notifikasi

```tsx
"use client";
import { useToast } from "@/components/Toast";

export default function MyComponent() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success("Berhasil!", "Data telah disimpan.")}>
      Simpan
    </button>
  );
}

// Tersedia: toast.success() | toast.error() | toast.warning() | toast.info()
```
