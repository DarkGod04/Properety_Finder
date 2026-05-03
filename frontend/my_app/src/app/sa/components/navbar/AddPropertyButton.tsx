'use client';




const AddPropertyButton = ({
    userId
}) => {
    // const loginModal = useLoginModal();
    // const addPropertyModal = useAddPropertyModal();

    const airbnbYourHome = () => {
        // if (userId) {
        //     addPropertyModal.open()
        // } else {
        //     loginModal.open();
        // }
    }

    return (
        <div 
            onClick={airbnbYourHome}
            className="p-2 cursor-pointer text-sm font-semibold rounded-full hover:bg-gray-200"
        >
            Djangobnb your home
        </div>
    )
}

export default AddPropertyButton;