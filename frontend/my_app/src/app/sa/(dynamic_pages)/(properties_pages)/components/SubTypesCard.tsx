import SubTypes from "../components/SubTypes"




export default function SubTypesCard({subtypes}) {

    return(
        <div className="bg-gray-200 p-3 rounded-xl">
            {subtypes.length === 0 ? (
                            <p className="text-gray-500 mt-8">
                                No subtypes found.
                            </p>
                        ) : (
                            <div className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {subtypes.map((sub) => (
                                        <SubTypes key={sub.id} 
                                                sub={sub}
                                        />
                            ))}
                            </div>
                        )
            }
        </div>
        )
};