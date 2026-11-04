import MaterialManager from "@/components/admin/MaterialManager";
import { listColors, listMaterials } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminMaterialsPage() {
  const materials = listMaterials();
  const colors = listColors();

  return (
    <div>
      <header className="mb-6">
        <p className="eyebrow">Каталог</p>
        <h1 className="mt-2 font-display text-[26px]">Материал ба өнгө</h1>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-charcoal/55">
          Материалын үнэ, бүтэц, боломжийг засварлана. Өнгөний код, нэр, бүлэг, swatch
          зургийг удирдана. Кодыг өөрчлөхдөө үйлдвэрлэгчийн эх кодыг яг хэвээр хадгална уу.
        </p>
      </header>

      <MaterialManager materials={materials} colors={colors} />
    </div>
  );
}
