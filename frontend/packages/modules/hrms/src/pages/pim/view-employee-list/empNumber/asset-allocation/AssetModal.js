import {
  Button,
  Checkbox,
  Divider,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";
import AssetAllocationForm from "./AssetAllocationForm";

export default function AssetModal({
  isOpen,
  onOpenChange,
  asset,
  setAsset,
  assetList,
  formElements,
  modalData,
  setModalData,
  handleSaveAsset,
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        placement="top-center"
        backdrop={"blur"}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-center gap-1">
                Update Asset
              </ModalHeader>
              <Divider />
              <ModalBody>
                <AssetAllocationForm
                  asset={asset}
                  setAsset={setAsset}
                  assetList={assetList}
                  formElements={formElements}
                  modalData={modalData}
                  setModalData={setModalData}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="h-7 rounded-full"
                  color="primary"
                  onPress={() => {
                    handleSaveAsset("PUT");
                  }}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
