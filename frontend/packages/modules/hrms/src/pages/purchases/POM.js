"use client";
import React, { useState, useRef } from "react";
import { Button, Input } from "@nextui-org/react";

export default function POM() {
  const [supplier, setSupplier] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [items, setItems] = useState([
    {
      description: "",
      quantity: 0,
      pricePerItem: 0,
      discountPerUnit: 0,
      discountPerLot: 0,
      totalPrice: 0,
    },
  ]);

  const inputsRef = useRef([]);

  const addItem = () => {
    setItems((prevItems) => {
      const newItems = [
        ...prevItems,
        {
          description: "",
          quantity: 0,
          pricePerItem: 0,
          discountPerUnit: 0,
          discountPerLot: 0,
          totalPrice: 0,
        },
      ];
      setTimeout(() => {
        // Move focus to the description of the newly added item
        const newItemIndex = newItems.length - 1;
        if (inputsRef.current[newItemIndex * 6]) {
          inputsRef.current[newItemIndex * 6].focus();
        }
      }, 0);
      return newItems;
    });
  };

  const removeItem = (index) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((_, i) => i !== index);
      return updatedItems;
    });
  };

  const handleItemChange = (index, field, value) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index][field] = parseFloat(value) || 0;
      const { quantity, pricePerItem, discountPerUnit, discountPerLot } =
        updatedItems[index];
      updatedItems[index].totalPrice =
        quantity * pricePerItem - quantity * discountPerUnit - discountPerLot;
      return updatedItems;
    });
  };

  const handleKeyDown = (e, index, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputRefs = inputsRef.current;
      const currentRowInputs = inputRefs.slice(index * 6, (index + 1) * 6);

      if (field === "totalPrice") {
        // If focus is on the total price input, add a new row and move focus to the description of the new row
        addItem();
      } else {
        // Move focus to the next input field
        const currentInputIndex = currentRowInputs.indexOf(e.target);
        const nextInputIndex =
          currentInputIndex + 1 < currentRowInputs.length
            ? currentInputIndex + 1
            : null;

        if (nextInputIndex !== null) {
          currentRowInputs[nextInputIndex]?.focus();
        } else {
          addItem(); // Add new row if on the last input field
        }
      }
    }
  };

  const handleRemoveKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      supplier,
      orderNumber,
      orderDate,
      gstNo,
      modeOfPayment,
      items,
    };
    // Handle form submission logic here (e.g., API calls)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="p-4 bg-white rounded-lg shadow-md mx-auto">
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Supplier Name */}
            <div>
              <Input
                autoFocus
                aria-label="Supplier Name"
                placeholder="Enter supplier name"
                variant="bordered"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value.toUpperCase())}
              />
            </div>

            {/* Purchase Order Number */}
            <div>
              <Input
                aria-label="Purchase Order Number"
                placeholder="Enter purchase order number"
                variant="bordered"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              />
            </div>

            {/* Order Date */}
            <div>
              <Input
                type="date"
                aria-label="Order Date"
                variant="bordered"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>

            {/* Mode of Payment */}
            <div>
              <Input
                aria-label="Mode of Payment"
                placeholder="Enter mode of payment"
                variant="bordered"
                value={modeOfPayment}
                onChange={(e) => setModeOfPayment(e.target.value.toUpperCase())}
              />
            </div>

            {/* GST No */}
            <div className="md:col-span-2">
              <Input
                aria-label="GST Number"
                placeholder="Enter GST number"
                variant="bordered"
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Quantity</th>
                    <th className="border border-gray-300 p-2">
                      Price per Item
                    </th>
                    <th className="border border-gray-300 p-2">
                      Discount per Unit
                    </th>
                    <th className="border border-gray-300 p-2">
                      Discount per Lot
                    </th>
                    <th className="border border-gray-300 p-2">Total Price</th>
                    <th className="border border-gray-300 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <Input
                          aria-label={`Item Description #${index + 1}`}
                          placeholder={`Enter description #${index + 1}`}
                          variant="bordered"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "description",
                              e.target.value.toUpperCase()
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, index, "description")
                          }
                          ref={(el) => (inputsRef.current[index * 6] = el)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          aria-label="Quantity"
                          placeholder="Enter quantity"
                          variant="bordered"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index, "quantity")}
                          ref={(el) => (inputsRef.current[index * 6 + 1] = el)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          aria-label="Price per Item"
                          placeholder="Enter price per item"
                          variant="bordered"
                          value={item.pricePerItem}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "pricePerItem",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, index, "pricePerItem")
                          }
                          ref={(el) => (inputsRef.current[index * 6 + 2] = el)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          aria-label="Discount per Unit"
                          placeholder="Enter discount per unit"
                          variant="bordered"
                          value={item.discountPerUnit}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "discountPerUnit",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, index, "discountPerUnit")
                          }
                          ref={(el) => (inputsRef.current[index * 6 + 3] = el)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          aria-label="Discount per Lot"
                          placeholder="Enter discount per lot"
                          variant="bordered"
                          value={item.discountPerLot}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "discountPerLot",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleKeyDown(e, index, "discountPerLot")
                          }
                          ref={(el) => (inputsRef.current[index * 6 + 4] = el)}
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          type="number"
                          aria-label="Total Price"
                          placeholder="Total Price"
                          variant="bordered"
                          value={item.totalPrice}
                          readOnly
                          ref={(el) => (inputsRef.current[index * 6 + 5] = el)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, index, "totalPrice")
                          }
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <Button
                          color="error"
                          auto
                          onClick={() => removeItem(index)}
                          onKeyDown={(e) => handleRemoveKeyDown(e, index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              shadow
              color="success"
              auto
              onClick={addItem}
              className="mt-4"
            >
              Add Another Item
            </Button>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button type="submit" shadow color="primary" auto>
              Submit Purchase Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
