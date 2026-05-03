'use client';



const MenuLink= ({ label, onClick }) => {
   

    return (
        <div 
            onClick={onClick}
            className="px-5 py-4 cursor-pointer hover:bg-gray-100 transition"
        > 
            {label}
        </div>
    )
}

export default MenuLink;