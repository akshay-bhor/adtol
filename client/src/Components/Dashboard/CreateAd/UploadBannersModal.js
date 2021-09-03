import Modal from "../../UI/Modal"

const UploadBannersModal = (props) => {
    return (
        <Modal title="Upload Banners" maxWidth="lg" onClose={props.onClose} maxWidth="md"></Modal>
    );
}

export default UploadBannersModal;