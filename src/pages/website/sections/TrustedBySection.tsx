import { useQuery } from "@tanstack/react-query";

import clientLogo from "@/assets/client1.webp";
import { getTrustedBrands, type TrustedBrand } from "@/lib/trustedBrands";

const fallbackTrustedBrands: TrustedBrand[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: index + 1,
    name: `Client ${index + 1}`,
    logo_url: clientLogo,
    website_url: null,
    sort_order: index,
    is_active: true,
  }),
);

function resolveLogoUrl(logoUrl: string) {
  if (!logoUrl || logoUrl === "/src/assets/client1.webp") {
    return clientLogo;
  }

  return logoUrl;
}

export function TrustedBySection() {
  const { data } = useQuery({
    queryKey: ["trusted-brands"],
    queryFn: getTrustedBrands,
  });

  const trustedBrands =
    data && data.length > 0
      ? data.filter((brand) => brand.is_active)
      : fallbackTrustedBrands;

  return (
    <section className="bg-black px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto w-full max-w-[1560px]">
        <p className="text-center text-sm font-light uppercase text-white/60 sm:text-sm">
          Trusted by 150+ enterprises
        </p>

        <div className="mt-20 grid grid-cols-2 items-center gap-x-8 gap-y-14 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-5 lg:gap-x-12 lg:gap-y-18">
          {trustedBrands.map((brand) => (
            <div
              key={brand.id}
              className="mx-auto flex h-13 w-full max-w-36 items-center justify-center px-3 opacity-80 grayscale transition-opacity hover:opacity-100 sm:h-16 sm:max-w-48"
            >
              <img
                src={resolveLogoUrl(brand.logo_url)}
                alt={brand.name}
                className="h-auto max-h-8 w-auto max-w-full object-contain brightness-0 invert sm:max-h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
