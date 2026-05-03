// src/app/sa/(dynamic_pages)/listProperty.tsx

export default function listPropertyPage() {
    
    const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
    console.log("Current country:", countrySlug);        
    
    return  (
            <>
                <section>
                    <h1 className="">listPropertyPage</h1>
                </section>
            </>)
}