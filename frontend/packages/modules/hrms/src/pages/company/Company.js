// "use client";
// import { getCookie } from "@/utils/cookieUtils";
// import {
//   Card,
//   CardBody,
//   CardFooter,
//   CardHeader,
//   Divider,
//   Link,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   useDisclosure,
//   Input,
// } from "@nextui-org/react";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { GrEdit } from "react-icons/gr";
// import { IoAdd } from "react-icons/io5";

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// const initialValue = {
//   address: "",
//   ceo: "",
//   cinNo: "",
//   createdBy: "",
//   description: "",
//   email: "",
//   establishedDate: "",
//   gstNo: "",
//   id: "",
//   industry: "",
//   name: "",
//   numberOfEmployees: "",
//   phoneNumber: "",
//   stamp: "",
//   status: "",
//   tinNo: "",
//   website: "",
//   zoneId: "",
// };
// export default function Company() {
//   const [data, setData] = useState(initialValue);
//   const [newForm, setNewForm] = useState(initialValue);

//   useEffect(() => {
//     getdata();
//   }, []);

//   async function getdata() {
//     const token = await getCookie("accessToken");
//     const response = await fetch(
//       `${baseUrl}/api/v1/com-profile/company-find/1`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     if (response.ok) {
//       const responseData = await response.json();
//       setData(responseData);
//     }
//   }

//   const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewForm({ ...newForm, [name]: value });
//   };

//   async function handleSubmit(addCompany) {
//     const token = await getCookie("accessToken");
//     const url = addCompany
//       ? `${baseUrl}/api/v1/com-profile/create`
//       : `${baseUrl}/api/v1/com-profile/edit/1`;
//     const response = await fetch(url, {
//       method: addCompany ? "POST" : "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(newForm),
//     });
//     if (response.ok) {
//       const responseData = await response.text();
//       toast.success(responseData);
//       onOpenChange(false); // Close the modal after submission
//     }
//   }

//   return (
//     <div>
//       <div className="pb-2">
//         <Button
//           color="primary"
//           startContent={<IoAdd />}
//           onClick={() => {
//             setNewForm(initialValue);
//             onOpen();
//           }}
//         >
//           Add Company
//         </Button>
//       </div>
//       <Card className="max-w-[400px]">
//         <CardHeader className="flex gap-3">
//           <div className="flex flex-col w-full">
//             <p className="text-md font-bold flex w-full items-center justify-between">
//               {data?.name}
//               <button
//                 onClick={() => {
//                   setNewForm(data);
//                   onOpen();
//                 }}
//               >
//                 <GrEdit color="blue" size={25} />
//               </button>
//             </p>
//             <p className="text-small text-default-500">{data?.website}</p>
//           </div>
//         </CardHeader>
//         <Divider />
//         <CardBody>
//           <p>
//             <span className="font-semibold">Address:</span> {data?.address}
//           </p>
//           <p>
//             <span className="font-semibold">Phone:</span> {data?.phoneNumber}
//           </p>
//           <p>
//             <span className="font-semibold">Email:</span> {data?.email}
//           </p>
//           <p>
//             <span className="font-semibold">Industry:</span> {data?.industry}
//           </p>
//           <p>
//             <span className="font-semibold">Number of Employees:</span>{" "}
//             {data?.numberOfEmployees}
//           </p>
//           <p>
//             <span className="font-semibold">Established Date:</span>{" "}
//             {data?.establishedDate}
//           </p>
//           <p>
//             <span className="font-semibold">CEO:</span> {data?.ceo}
//           </p>
//           <p>
//             <span className="font-semibold">Description:</span>{" "}
//             {data?.description}
//           </p>
//         </CardBody>
//         <Divider />
//         <CardFooter>
//           <Link isExternal showAnchorIcon href={`https://${data?.website}`}>
//             Visit our website
//           </Link>
//         </CardFooter>
//       </Card>
//       <Modal
//         scrollBehavior="inside"
//         isOpen={isOpen}
//         onOpenChange={onOpenChange}
//         placement="top-center"
//         size="2xl"
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">
//                 Edit Company Details
//               </ModalHeader>
//               <ModalBody className="grid grid-cols-2 gap-4">
//                 {Object.keys(newForm)
//                   .filter((key) => key !== "stamp")
//                   .map((key) => (
//                     <Input
//                       key={key}
//                       label={
//                         key.charAt(0).toUpperCase() +
//                         key.slice(1).replace(/([A-Z])/g, " $1")
//                       }
//                       name={key}
//                       value={newForm[key]}
//                       onChange={handleChange}
//                       fullWidth
//                       variant="bordered"
//                       type={
//                         key === "numberOfEmployees"
//                           ? "number"
//                           : key === "establishedDate"
//                           ? "date"
//                           : "text"
//                       }
//                     />
//                   ))}
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="danger" variant="flat" onPress={onClose}>
//                   Close
//                 </Button>
//                 <Button color="primary" onPress={handleSubmit}>
//                   Save
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// }

"use client";
import { getCookie } from "@/utils/cookieUtils";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import { IoAdd } from "react-icons/io5";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
const initialValue = {
  name: "",
  address: "",
  phoneNumber: "",
  email: "",
  website: "",
  industry: "",
  numberOfEmployees: "",
  establishedDate: "",
  ceo: "",
  description: "",
  gstNo: "",
  cinNo: "",
  tinNo: "",
  createdBy: "",
  zoneId: "",
};
export default function Company() {
  const pathName = usePathname();
  const [data, setData] = useState(initialValue);
  const [newForm, setNewForm] = useState(initialValue);

  useEffect(() => {
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getdata() {
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/com-profile/company-find/1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      setData(responseData);
    }
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewForm({ ...newForm, [name]: value });
  };

  async function handleSubmit(addCompany) {
    const token = await getCookie("accessToken");
    const url = addCompany
      ? `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/com-profile/create`
      : `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/com-profile/edit/1`;

    // Create a new object with only the specified fields for the create operation
    const filteredForm = {
      name: newForm.name,
      address: newForm.address,
      phoneNumber: newForm.phoneNumber,
      email: newForm.email,
      website: newForm.website,
      industry: newForm.industry,
      numberOfEmployees: newForm.numberOfEmployees,
      establishedDate: newForm.establishedDate,
      ceo: newForm.ceo,
      description: newForm.description,
      gstNo: newForm.gstNo,
      cinNo: newForm.cinNo,
      tinNo: newForm.tinNo,
      createdBy: 1, // Assuming 'createdBy' and 'zoneId' are constants
      zoneId: 101,
    };

    const response = await fetch(url, {
      method: addCompany ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filteredForm),
    });
    if (response.ok) {
      const responseData = await response.text();
      toast.success(responseData);
      onOpenChange(false); // Close the modal after submission
      getdata(); // Refresh data after submission
    }
  }

  return (
    <div>
      <div className="pb-2">
        <Button
          color="primary"
          startContent={<IoAdd />}
          onClick={() => {
            setNewForm(initialValue);
            onOpen();
          }}
        >
          Add Company
        </Button>
      </div>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col w-full">
            <p className="text-md font-bold flex w-full items-center justify-between">
              {data?.name}
              <button
                onClick={() => {
                  setNewForm(data);
                  onOpen();
                }}
              >
                <GrEdit color="blue" size={25} />
              </button>
            </p>
            <p className="text-small text-default-500">{data?.website}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            <span className="font-semibold">Address:</span> {data?.address}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {data?.phoneNumber}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {data?.email}
          </p>
          <p>
            <span className="font-semibold">Industry:</span> {data?.industry}
          </p>
          <p>
            <span className="font-semibold">Number of Employees:</span>{" "}
            {data?.numberOfEmployees}
          </p>
          <p>
            <span className="font-semibold">Established Date:</span>{" "}
            {data?.establishedDate}
          </p>
          <p>
            <span className="font-semibold">CEO:</span> {data?.ceo}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {data?.description}
          </p>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link isExternal showAnchorIcon href={`https://${data?.website}`}>
            Visit our website
          </Link>
        </CardFooter>
      </Card>
      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Company Details
              </ModalHeader>
              <ModalBody className="grid grid-cols-2 gap-4">
                {Object.keys(newForm)
                  .filter((key) => key !== "stamp")
                  .map((key) => (
                    <Input
                      key={key}
                      label={
                        key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      name={key}
                      value={newForm[key]}
                      onChange={handleChange}
                      fullWidth
                      variant="bordered"
                      type={
                        key === "numberOfEmployees"
                          ? "number"
                          : key === "establishedDate"
                          ? "date"
                          : "text"
                      }
                    />
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => handleSubmit(true)}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
