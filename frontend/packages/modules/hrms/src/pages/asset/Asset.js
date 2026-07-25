"use client";
import { getCookie } from "@/utils/cookieUtils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getBackgroundColor } from "@/utils/getBackgroundColor";
import { getAssetList } from "@/utils/getDesgnData";
import { BsTrash3Fill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import CustomTable from "@/components/tables/Table";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function Asset() {
  const pathName = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [color, setColor] = useState("");
  const [newAsset, setNewAsset] = useState({
    assetId: "",
    assetName: "",
  });
  const [assetList, setAssetList] = useState([]);

  useEffect(() => {
    getAssetData();
    (async () => {
      const cookdata = await getCookie("zone");
      setColor(getBackgroundColor(cookdata)); // Updated to use client-side cookie access
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAssetData = useCallback(
    () => getAssetList(setAssetList, pathName),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const addAsset = async (onClose) => {
    const token = await getCookie("accessToken");
    const url = `${baseUrl}/api/spshrm/${
      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
    }/assets/${newAsset.assetId ? newAsset.assetId : "new-asset"}`;
    try {
      const response = await fetch(url, {
        method: newAsset.assetId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetName: newAsset.assetName,
        }),
      });
      const responseData = await response.text();
      if (response.status === 409) {
        toast.error(responseData);
      }
      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }

      toast.success(
        `${newAsset.assetId ? "Updated" : "Added"} Department Successfully`
      );
      setNewAsset({ assetId: "", assetName: "" });
      getAssetData();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  const columns = [
    { key: "assetName", value: "Asset Name" },
    { key: "action", value: "Action" },
  ];

  const actionButtons = useMemo(
    () => [
      {
        name: "Edit",
        action: (row) => {
          setNewAsset(row);
          onOpen();
        },
        color: "#ffdb18",
        iconOnly: true,
        icon: <GrEdit size={25} color="#ffdb18" />,
      },
      {
        name: "Delete",
        action: async (row) => {
          const userConfirmed = window.confirm(
            `Are you sure you want to Delete ${row.assetName}?`
          );
          if (!userConfirmed) return;
          const token = await getCookie("accessToken");
          const response = await fetch(
            `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/assets/${
              row.assetId
            }`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            toast.success("Deleted");
            getAssetData();
          }
        },
        variant: "solid",
        color: "#f50000",
        iconOnly: true,
        icon: <BsTrash3Fill size={25} color="#F50000" />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="p-5">
      <div className="flex w-full justify-end pb-2">
        <Button
          className={`h-8 rounded-full text-white ${color}`}
          onClick={() => {
            setNewAsset((prevData) => ({
              ...prevData,
              zoneId: 505,
            }));
            onOpen();
          }}
        >
          Add Asset
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={assetList}
        actionButtons={actionButtons}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setNewAsset({ assetId: "", assetName: "" });
          onOpenChange();
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1">
                Add Asset
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  aria-label="Department"
                  placeholder="Enter department"
                  variant="bordered"
                  value={newAsset.assetName}
                  onChange={(e) => {
                    setNewAsset((prevData) => ({
                      ...prevData,
                      assetName: e.target.value.toUpperCase(),
                    }));
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="h-7 rounded-full"
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  className="h-7 rounded-full"
                  color="primary"
                  onPress={() => addAsset(onClose)}
                >
                  {newAsset.assetId ? "Save" : "Add"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
