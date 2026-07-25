"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaRegIdCard } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdVerified } from "react-icons/md";
import { getCookie } from "@/utils/cookieUtils";
import { getData } from "@/utils/api";
import { getAllArea, getDesgnData } from "@/utils/getDesgnData";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function Dashboard() {
  const pathName = usePathname();
  const [datas, setDatas] = useState([]);
  const [desgn, setDesgn] = useState([]);
  const [areas, setAreas] = useState([]);

  const areaList = useCallback(
    () => getAllArea(setAreas, pathName, setAreas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const desgnData = useCallback(() => getDesgnData(setDesgn, pathName), []);

  useEffect(() => {
    desgnData();
    areaList();
  }, [desgnData, areaList]);

  const [area, setArea] = useState({
    area: [],
    circle: [],
    division: [],
    subDivision: [],
  });

  useEffect(() => {
    (async () => {
      const token = await getCookie("accessToken");
      const response = await getData(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[1]]
        }/staff/temp-api/all`,
        token
      );
      setDatas(response);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const areaSet = new Set();
    const circleSet = new Set();
    const divisionSet = new Set();
    const subDivisionSet = new Set();

    areas.forEach(({ area, circle, division, subDivision }) => {
      areaSet.add(area);
      circleSet.add(circle);
      divisionSet.add(division);
      subDivisionSet.add(subDivision);
    });

    setArea({
      area: [...areaSet],
      circle: [...circleSet],
      division: [...divisionSet],
      subDivision: [...subDivisionSet],
    });
  }, [areas]);

  const metrics = [
    {
      label: "Total Number Of Employees",
      key: "postOf",
      value: "TRUE",
      icon: FaPeopleGroup,
    },
    {
      label: "ID Cards issued",
      key: "isIdGenrated",
      value: "TRUE",
      icon: FaRegIdCard,
    },
    {
      label: "Offer Letter issued",
      key: "isOfferGenrated",
      value: "TRUE",
      icon: SlEnvolopeLetter,
    },
    {
      label: "Police Verification Completed",
      key: "isCharaterVerified",
      value: "TRUE",
      icon: MdVerified,
    },
  ];

  const counts = area.area.reduce((acc, areaName) => {
    acc[areaName] = metrics.reduce((metricAcc, metric) => {
      metricAcc[metric.label] = {
        value: [],
        postCounts: desgn.reduce((postAcc, post) => {
          postAcc[post.desigName] = [];
          return postAcc;
        }, {}),
      };
      return metricAcc;
    }, {});
    acc[areaName]["Total Number Of Employees"] = {
      value: [],
      postCounts: desgn.reduce((postAcc, post) => {
        postAcc[post.desigName] = [];
        return postAcc;
      }, {}),
    };
    return acc;
  }, {});

  Array.isArray(datas) &&
    datas.length &&
    datas.forEach((ele) => {
      const post = desgn.find(
        (item) => item.desigId.toString() === ele?.desigId?.toString()
      )?.desigName;

      if (ele.area?.area) {
        const areaName = ele.area.area;

        if (ele.desigId) {
          counts[areaName] &&
            counts[areaName]["Total Number Of Employees"].value.push(ele);
          if (post) {
            counts[areaName] &&
              counts[areaName]["Total Number Of Employees"].postCounts[
                post
              ].push(ele);
          }
        }

        metrics.forEach((metric) => {
          if (ele[metric.key] === metric.value) {
            counts[areaName] && counts[areaName][metric.label].value.push(ele);
            if (post) {
              counts[areaName] &&
                counts[areaName][metric.label].postCounts[post].push(ele);
            }
          }
        });
      }
    });

  const data = metrics.flatMap((metric) =>
    area.area.map((areaName) => {
      return {
        icon: metric.icon,
        label: `${metric.label} in ${areaName}`,
        value: counts[areaName][metric.label].value,
        ...counts[areaName][metric.label].postCounts,
      };
    })
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
        {data.map((item, index) => (
          <Card key={index} className="bg-gray-100 hover:shadow-lg">
            <CardBody className="flex items-center justify-center">
              <div className="flex flex-col items-center w-full text-center font-semibold text-black">
                <div className="flex gap-3 items-center">
                  <item.icon size={30} className="text-blue-500" />
                  <div className="text-md font-bold">{item.label}</div>:
                  <div className="text-md font-bold text-blue-700">
                    {item.value.length}
                  </div>
                </div>
                {desgn.map((post) => (
                  <div
                    key={post.desigName}
                    className="flex gap-3 w-full justify-between items-center"
                  >
                    <div className="text-sm">{post.desigName}</div>
                    <div className="text-sm text-blue-700 w-8 items-center flex justify-between">
                      <span>:</span>
                      <div>{item[post.desigName].length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}
