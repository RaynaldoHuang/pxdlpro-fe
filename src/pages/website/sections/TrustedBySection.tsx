import { useQuery } from "@tanstack/react-query";

import { getTrustedBrands } from "@/lib/trustedBrands";

function resolveLogoUrl(logoUrl: string) {
  return logoUrl;
}

export function TrustedBySection() {
  const { data } = useQuery({
    queryKey: ["trusted-brands"],
    queryFn: getTrustedBrands,
  });

  const trustedBrands = data?.filter((brand) => brand.is_active) ?? [];

  if (trustedBrands.length === 0) {
    return null;
  }

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
