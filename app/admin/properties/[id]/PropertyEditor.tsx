"use client";

import {
  createProperty,
  editProperty,
  SpecialDateData,
} from "@/actions/propertyActions";
import AreaSelector from "@/components/AreaSelector";
import LabelWrapper from "@/components/LabelWrapper";
import MyButton from "@/components/MyButton";
import TimeSelector from "@/components/TimeSelector";
import {
  _AreaData,
  _CityData,
  Activity,
  ActivityData,
  Amenity,
  AmenityData,
  PropertyData,
  PropertyTypeData,
  StateData,
} from "@/utils/types";
import { parseServerActionResult } from "@/utils/utils";
import {
  Button,
  Checkbox,
  Datepicker,
  Select,
  TabItem,
  Tabs,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { DateTime } from "luxon";
import { FormEvent, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { HiMinus, HiPlus } from "react-icons/hi";
import { v4 } from "uuid";

interface PropertyEditorProps {
  data?: PropertyData;
  specialDatesData?: SpecialDateData[];
  propertyTypes: PropertyTypeData[];
  amenityData: Amenity[];
  activityData: Activity[];
  areaData: _AreaData[];
  cityData: _CityData[];
  stateData: StateData[];
}

const createNewSpecialDate = (): SpecialDateData => ({
  id: v4(),
  date: DateTime.now().toFormat("yyyy-LL-dd"),
  price: null,
  adultExtraGuestCharge: null,
  childExtraGuestCharge: null,
  infantExtraGuestCharge: null,
  baseGuestCount: null,
  discount: null,
});

const createNewActivity = (): ActivityData => ({
  id: v4(),
  weight: null,
  activity: "",
  isPaid: false,
  isUSP: false,
});

const createNewAmenity = (): AmenityData => ({
  id: v4(),
  weight: null,
  amenity: "",
  isPaid: false,
  isUSP: false,
});

export default function PropertyEditor(props: PropertyEditorProps) {
  const [loading, startTransition] = useTransition();

  const [daywisePrice, setDaywisePrice] = useState<boolean>(false);
  const [checkinTime, setCheckinTime] = useState<string | null>(null);
  const [checkoutTime, setCheckoutTime] = useState<string | null>(null);
  const [specialDateData, setSpecialDateData] = useState<SpecialDateData[]>(
    props.specialDatesData?.length ? props.specialDatesData : [],
  );
  const [amenities, setAmenities] = useState<AmenityData[]>(
    props.data?.amenities ? props.data.amenities : [],
  );
  const [activities, setActivities] = useState<ActivityData[]>(
    props.data?.activities ? props.data.activities : [],
  );

  const addActivity = () => {
    setActivities([...activities, createNewActivity()]);
  };

  const removeActivity = (id: string) => {
    setActivities(activities.filter((x) => x.id !== id));
  };

  const addAmenity = () => {
    setAmenities([...amenities, createNewAmenity()]);
  };

  const removeAmenity = (id: string) => {
    setAmenities(amenities.filter((x) => x.id !== id));
  };

  const removeSpecialDate = (id: string) => {
    setSpecialDateData([...specialDateData.filter((sd) => sd.id !== id)]);
  };

  const updateSpecialDate = (data: SpecialDateData) => {
    setSpecialDateData(
      specialDateData.map((sd) => (sd.id === data.id ? data : sd)),
    );
  };

  const addSpecialDate = () =>
    setSpecialDateData([...specialDateData, createNewSpecialDate()]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.set("daywisePrice", daywisePrice ? "true" : "false");
    formData.set("checkinTime", checkinTime ? checkinTime : "");
    formData.set("checkoutTime", checkoutTime ? checkoutTime : "");
    startTransition(() => {
      let promise: Promise<string>;
      if (props.data) {
        const editPropertyWithId = editProperty.bind(null, props.data.id);
        promise = parseServerActionResult(editPropertyWithId(formData));
      } else {
        promise = parseServerActionResult(createProperty(formData));
      }

      toast.promise(promise, {
        loading: "Saving property...",
        success: (data) => {
          return data;
        },
        error: (err) => (err as Error).message,
      });
    });
  };

  useEffect(() => {
    // Fill the form with loaded data on render
    if (props.data) {
      setDaywisePrice(props.data.isDisabled ? true : false);
      (document.getElementById("propertyName") as HTMLInputElement).value =
        props.data.propertyName || "";
      (document.getElementById("propertyCode") as HTMLInputElement).value =
        props.data.propertyCode || "";
      (document.getElementById("propertyTypeId") as HTMLSelectElement).value =
        props.data.propertyTypeId || "";
      (document.getElementById("isDisabled") as HTMLSelectElement).value = props
        .data.isDisabled
        ? "true"
        : "false";
      (document.getElementById("bedroomCount") as HTMLInputElement).value =
        props.data.bedroomCount?.toString() || "";
      (document.getElementById("bathroomCount") as HTMLInputElement).value =
        props.data.bathroomCount?.toString() || "";
      (document.getElementById("doubleBedCount") as HTMLInputElement).value =
        props.data.doubleBedCount?.toString() || "";
      (document.getElementById("singleBedCount") as HTMLInputElement).value =
        props.data.singleBedCount?.toString() || "";
      (document.getElementById("mattressCount") as HTMLInputElement).value =
        props.data.mattressCount?.toString() || "";
      (document.getElementById("baseGuestCount") as HTMLInputElement).value =
        props.data.baseGuestCount?.toString() || "";
      (document.getElementById("maxGuestCount") as HTMLInputElement).value =
        props.data.maxGuestCount?.toString() || "";
      (document.getElementById("bookingType") as HTMLSelectElement).value =
        props.data.bookingType || "";

      const prefixes = [
        "weekday",
        "weekend",
        "weekendSaturday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ] as const;

      setDaywisePrice(props.data.daywisePrice ? true : false);
      prefixes.forEach((prefix) => {
        if (props.data) {
          (
            document.getElementById(`${prefix}Price`) as HTMLInputElement
          ).value = props.data[`${prefix}Price`]?.toString() || "";
          (
            document.getElementById(
              `${prefix}AdultExtraGuestCharge`,
            ) as HTMLInputElement
          ).value =
            props.data[`${prefix}AdultExtraGuestCharge`]?.toString() || "";
          (
            document.getElementById(
              `${prefix}ChildExtraGuestCharge`,
            ) as HTMLInputElement
          ).value =
            props.data[`${prefix}ChildExtraGuestCharge`]?.toString() || "";
          (
            document.getElementById(
              `${prefix}InfantExtraGuestCharge`,
            ) as HTMLInputElement
          ).value =
            props.data[`${prefix}InfantExtraGuestCharge`]?.toString() || "";
          (
            document.getElementById(
              `${prefix}BaseGuestCount`,
            ) as HTMLInputElement
          ).value = props.data[`${prefix}BaseGuestCount`]?.toString() || "";
          (
            document.getElementById(`${prefix}Discount`) as HTMLInputElement
          ).value = props.data[`${prefix}Discount`]?.toString() || "";
        }
      });

      (document.getElementById("address") as HTMLInputElement).value =
        props.data.address || "";

      (document.getElementById("latitude") as HTMLInputElement).value =
        props.data.latitude || "";
      (document.getElementById("longtitude") as HTMLInputElement).value =
        props.data.longtitude || "";
      (document.getElementById("mapLink") as HTMLInputElement).value =
        props.data.mapLink || "";

      props.data.amenities?.forEach((am) => {
        let el = document.getElementById(
          `amenity-weight-${am.id}`,
        ) as HTMLInputElement | null;
        if (el) {
          el.value = am.weight?.toString() || "";
        }
        el = document.getElementById(
          `amenity-isPaid-${am.id}`,
        ) as HTMLInputElement | null;
        if (el) {
          el.checked = am.isPaid || false;
        }
        el = document.getElementById(
          `amenity-isUSP-${am.id}`,
        ) as HTMLInputElement | null;
        if (el) {
          el.checked = am.isUSP || false;
        }
        const el2 = document.getElementById(
          `amenity-title-${am.id}`,
        ) as HTMLSelectElement | null;
        if (el2) {
          el2.value = am.amenity;
        }
      });
      props.data.activities?.forEach((am) => {
        let el = document.getElementById(
          `activity-weight-${am.id}`,
        ) as HTMLInputElement | null;
        if (el) {
          el.value = am.weight?.toString() || "";
        }
        el = document.getElementById(
          `activity-isPaid-${am.id}`,
        ) as HTMLInputElement | null;
        if (el) {
          el.checked = am.isPaid || false;
        }
        el = document.getElementById(
          `activity-isUSP-${am.id}`,
        ) as HTMLInputElement | null;
        if (el) {
          el.checked = am.isUSP || false;
        }
        const el2 = document.getElementById(
          `activity-title-${am.id}`,
        ) as HTMLSelectElement | null;
        if (el2) {
          el2.value = am.activity;
        }
      });
    }
  }, [props.data]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Tabs className="text-white">
        <TabItem title="Detail" className="align-center flex flex-col">
          <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-5">
            <LabelWrapper label="Property Name">
              <TextInput
                id="propertyName"
                name="propertyName"
                type="text"
                placeholder="Enter Property Name"
                required
              />
            </LabelWrapper>
            <LabelWrapper label="Property Code">
              <TextInput
                id="propertyCode"
                name="propertyCode"
                type="text"
                placeholder="Enter Property Code"
              />
            </LabelWrapper>
            <LabelWrapper label="Property Type">
              <Select id="propertyTypeId" name="propertyTypeId">
                <option value="">Select Property Type</option>
                {props.propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </LabelWrapper>
            <LabelWrapper label="Property Status">
              <Select id="isDisabled" name="isDisabled">
                <option value="false">Live</option>
                <option value="true">Disabled</option>
              </Select>
            </LabelWrapper>
            <div className="col-span-2 grid grid-cols-4 gap-5">
              <LabelWrapper label="Bedroom Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="bedroomCount"
                  name="bedroomCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Bathroom Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="bathroomCount"
                  name="bathroomCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Double Bed Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="doubleBedCount"
                  name="doubleBedCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Single Bed Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="singleBedCount"
                  name="singleBedCount"
                ></TextInput>
              </LabelWrapper>
            </div>
            <div className="col-span-2 grid grid-cols-4 gap-5">
              <LabelWrapper label="Mattress Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="mattressCount"
                  name="mattressCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Base Guest Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="baseGuestCount"
                  name="baseGuestCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Max Guest Count">
                <TextInput
                  type="numeric"
                  inputMode="numeric"
                  id="maxGuestCount"
                  name="maxGuestCount"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Booking Type">
                <Select id="bookingType" name="bookingType">
                  <option value="">Select booking type</option>
                  <option value="Online">Online</option>
                  <option value="Call">Call</option>
                  <option value="Enquiry">Enquiry</option>
                </Select>
              </LabelWrapper>
            </div>
            <LabelWrapper label="Check-in Time [HH:MM]">
              <TimeSelector timestamp={checkinTime} update={setCheckinTime} />
            </LabelWrapper>
            <LabelWrapper label="Check-out Time [HH:MM]">
              <TimeSelector timestamp={checkoutTime} update={setCheckoutTime} />
            </LabelWrapper>
          </div>
        </TabItem>
        <TabItem title="Day wise Variables">
          <div className="mx-auto flex flex-col gap-5">
            <ToggleSwitch
              checked={daywisePrice}
              onChange={setDaywisePrice}
              id="daywisePrice"
              name="daywisePrice"
              label="Enable Day wise Pricing"
            />
            <div className="flex flex-row text-sm">
              <div className="flex flex-grow flex-col">
                <p>
                  <span className="font-bold italic">Adult: </span>13 years and
                  older
                </p>
                <p>
                  <span className="font-bold italic">Child: </span>2 to 12 years
                  old
                </p>
                <p>
                  <span className="font-bold italic">Adult: </span>0 to 1 year
                  old
                </p>
              </div>
              {!daywisePrice && (
                <div className="flex flex-grow flex-col">
                  <p>
                    <span className="font-bold italic">Weekdays: </span>Monday,
                    Tuesday, Wednesday, Thursday
                  </p>
                  <p>
                    <span className="font-bold italic">Weekends: </span>Friday,
                    Sunday
                  </p>
                  <p>
                    <span className="font-bold italic">Saturdays: </span>
                    Saturday
                  </p>
                </div>
              )}
            </div>
            <table className="mt-5 table-fixed border-separate border-spacing-5">
              <thead>
                <tr>
                  <th className="text-left">Day</th>
                  <th>Base Price</th>
                  <th>Extra Guest Price(Adult-Child-Infant)</th>
                  <th>Base Guest Count</th>
                  <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="monday"
                  title="Monday"
                />
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="tuesday"
                  title="Tuesday"
                />
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="wednesday"
                  title="Wednesday"
                />
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="thursday"
                  title="Thursday"
                />
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="friday"
                  title="Friday"
                />
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="saturday"
                  title="Saturday"
                />
                <PricingRow
                  className={daywisePrice ? "" : "hidden"}
                  suffix="sunday"
                  title="Sunday"
                />

                <PricingRow
                  className={!daywisePrice ? "" : "hidden"}
                  suffix="weekday"
                  title="Weekdays"
                />
                <PricingRow
                  className={!daywisePrice ? "" : "hidden"}
                  suffix="weekend"
                  title="Weekends"
                />
                <PricingRow
                  className={!daywisePrice ? "" : "hidden"}
                  suffix="weekendSaturday"
                  title="Saturdays"
                />
              </tbody>
            </table>
          </div>
        </TabItem>
        <TabItem title="Address">
          <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-5">
            <div className="col-span-2">
              <LabelWrapper label="Address">
                <TextInput
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter Address"
                />
              </LabelWrapper>
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-5">
              <AreaSelector
                data={props.data}
                areaData={props.areaData}
                cityData={props.cityData}
                stateData={props.stateData}
              />
            </div>

            <div className="col-span-2 grid grid-cols-3 gap-5">
              <LabelWrapper label="Latitude">
                <TextInput
                  type="text"
                  inputMode="text"
                  id="latitude"
                  name="latitude"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Longtitude">
                <TextInput
                  type="text"
                  inputMode="text"
                  id="longtitude"
                  name="longtitude"
                ></TextInput>
              </LabelWrapper>
              <LabelWrapper label="Map Link">
                <TextInput
                  type="text"
                  inputMode="text"
                  id="mapLink"
                  name="mapLink"
                ></TextInput>
              </LabelWrapper>
            </div>
          </div>
        </TabItem>
        <TabItem title="Special Dates">
          <div className="flex flex-row text-sm">
            <div className="flex flex-grow flex-col">
              <p>
                <span className="font-bold italic">Adult: </span>13 years and
                older
              </p>
              <p>
                <span className="font-bold italic">Child: </span>2 to 12 years
                old
              </p>
              <p>
                <span className="font-bold italic">Adult: </span>0 to 1 year old
              </p>
            </div>
          </div>
          {specialDateData.length === 0 ? (
            <div className="my-5">
              <Button
                onClick={() => setSpecialDateData([createNewSpecialDate()])}
              >
                Create Special Date
              </Button>
            </div>
          ) : (
            <table className="mx-auto mt-5 w-full border-separate border-spacing-5">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th>Base Price</th>
                  <th>Extra Guest Price(Adult-Child-Infant)</th>
                  <th>Base Guest Count</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialDateData.map((sd, index) => (
                  <SpecialDateRow
                    data={sd}
                    setData={updateSpecialDate}
                    key={sd.id}
                    showPlusButton={specialDateData.length === index + 1}
                    addSpecialDate={addSpecialDate}
                    removeSpecialDate={() => removeSpecialDate(sd.id)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </TabItem>
        <TabItem title="Amenities">
          {amenities.length === 0 ? (
            <div className="my-5">
              <Button onClick={addAmenity}>Create Amenity</Button>
            </div>
          ) : (
            <table className="mx-auto mt-5 w-full border-separate border-spacing-5">
              <thead>
                <tr>
                  <th className="text-left">Amenity Name</th>
                  <th>Weight</th>
                  <th>isPaid</th>
                  <th>isUSP</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {amenities.map((amenity, index) => (
                  <AmenityRow
                    data={amenity}
                    amenityOptions={props.amenityData}
                    key={amenity.id}
                    showPlusButton={amenities.length === index + 1}
                    createAmenity={addAmenity}
                    removeAmenity={removeAmenity}
                  />
                ))}
              </tbody>
            </table>
          )}
        </TabItem>
        <TabItem title="Activities">
          {activities.length === 0 ? (
            <div className="my-5">
              <Button onClick={addActivity}>Create Activity</Button>
            </div>
          ) : (
            <table className="mx-auto mt-5 w-full border-separate border-spacing-5">
              <thead>
                <tr>
                  <th className="text-left">Activity Name</th>
                  <th>Weight</th>
                  <th>isPaid</th>
                  <th>isUSP</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => (
                  <ActivityRow
                    data={activity}
                    activityOptions={props.activityData}
                    key={activity.id}
                    showPlusButton={activities.length === index + 1}
                    createActivity={addActivity}
                    removeActivity={removeActivity}
                  />
                ))}
              </tbody>
            </table>
          )}
        </TabItem>
      </Tabs>
      <div className="flex justify-end">
        <MyButton type="submit" loading={loading}>
          Submit
        </MyButton>
      </div>
    </form>
  );
}

function PricingRow({
  suffix,
  title,
  className,
}: {
  suffix: string;
  title: string;
  className?: string;
}) {
  return (
    <tr className={className}>
      <td className="font-bold">{title}</td>
      <td className="justify-center align-middle">
        <div className="align-center flex flex-row justify-center">
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`${suffix}Price`}
            name={`${suffix}Price`}
            placeholder="Base Price"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="align-center flex flex-row justify-center gap-2">
          <TextInput
            className="inline max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`${suffix}AdultExtraGuestCharge`}
            name={`${suffix}AdultExtraGuestCharge`}
            placeholder="Adult"
          />
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`${suffix}ChildExtraGuestCharge`}
            name={`${suffix}ChildExtraGuestCharge`}
            placeholder="Child"
          />
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`${suffix}InfantExtraGuestCharge`}
            name={`${suffix}InfantExtraGuestCharge`}
            placeholder="Infant"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-center">
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`${suffix}BaseGuestCount`}
            name={`${suffix}BaseGuestCount`}
            placeholder="Guest Count"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-center">
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`${suffix}Discount`}
            name={`${suffix}Discount`}
            placeholder="Discount"
          />
        </div>
      </td>
    </tr>
  );
}

function SpecialDateRow({
  data,
  setData,
  className,
  showPlusButton,
  addSpecialDate,
  removeSpecialDate,
}: {
  data: SpecialDateData;
  setData: (d: SpecialDateData) => void;
  className?: string;
  showPlusButton: boolean;
  addSpecialDate: () => void;
  removeSpecialDate: () => void;
}) {
  const dt = DateTime.fromFormat(data.date, "yyyy-LL-dd").toJSDate();

  useEffect(() => {
    let el: HTMLInputElement;
    el = document.getElementById(
      `special-price-${data.id}`,
    ) as HTMLInputElement;
    if (el) {
      el.value = data.price?.toString() || "";
    }
    el = document.getElementById(
      `special-adultExtraGuestCharge-${data.id}`,
    ) as HTMLInputElement;
    if (el) {
      el.value = data.adultExtraGuestCharge?.toString() || "";
    }
    el = document.getElementById(
      `special-childExtraGuestCharge-${data.id}`,
    ) as HTMLInputElement;
    if (el) {
      el.value = data.childExtraGuestCharge?.toString() || "";
    }
    el = document.getElementById(
      `special-infantExtraGuestCharge-${data.id}`,
    ) as HTMLInputElement;
    if (el) {
      el.value = data.infantExtraGuestCharge?.toString() || "";
    }
    el = document.getElementById(
      `special-baseGuestCount-${data.id}`,
    ) as HTMLInputElement;
    if (el) {
      el.value = data.baseGuestCount?.toString() || "";
    }
    el = document.getElementById(
      `special-discount-${data.id}`,
    ) as HTMLInputElement;
    if (el) {
      el.value = data.discount?.toString() || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <tr className={className}>
      <td className="font-bold">
        <Datepicker
          id={`special-date-${data.id}`}
          name={`special-date-${data.id}`}
          value={dt}
          onChange={(d) =>
            d &&
            setData({
              ...data,
              date: DateTime.fromJSDate(d).toFormat("yyyy-LL-dd"),
            })
          }
        />
      </td>
      <td className="justify-center align-middle">
        <div className="align-center flex flex-row justify-center">
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`special-price-${data.id}`}
            name={`special-price-${data.id}`}
            placeholder="Base Price"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="align-center flex flex-row justify-center gap-2">
          <TextInput
            className="inline max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`special-adultExtraGuestCharge-${data.id}`}
            name={`special-adultExtraGuestCharge-${data.id}`}
            placeholder="Adult"
          />
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`special-childExtraGuestCharge-${data.id}`}
            name={`special-childExtraGuestCharge-${data.id}`}
            placeholder="Child"
          />
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`special-infantExtraGuestCharge-${data.id}`}
            name={`special-infantExtraGuestCharge-${data.id}`}
            placeholder="Infant"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <TextInput
          className="max-w-36"
          type="numeric"
          inputMode="numeric"
          id={`special-baseGuestCount-${data.id}`}
          name={`special-baseGuestCount-${data.id}`}
          placeholder="Base Guest Count"
        />
      </td>
      <td className="align-center justify-center">
        <TextInput
          className="max-w-36"
          type="numeric"
          inputMode="numeric"
          id={`special-discount-${data.id}`}
          name={`special-discount-${data.id}`}
          placeholder="Discount"
        />
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-start gap-5">
          <Button
            className="bg-primary-500 aspect-square p-2"
            onClick={removeSpecialDate}
          >
            <HiMinus className="" />
          </Button>
          {showPlusButton && (
            <Button
              className="bg-primary-500 aspect-square p-2"
              onClick={addSpecialDate}
            >
              <HiPlus />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function AmenityRow({
  amenityOptions,
  data,
  showPlusButton,
  createAmenity,
  removeAmenity,
  className,
}: {
  data: AmenityData;
  amenityOptions: Amenity[];
  removeAmenity: (id: string) => void;
  createAmenity: () => void;
  className?: string;
  showPlusButton: boolean;
}) {
  return (
    <tr className={className}>
      <td className="">
        <Select
          id={`amenity-title-${data.id}`}
          name={`amenity-title-${data.id}`}
        >
          <option value="">Select Amenity</option>
          {amenityOptions.map((x) => (
            <option key={x.id} value={x.amenity}>
              {x.amenity}
            </option>
          ))}
        </Select>
      </td>
      <td className="justify-center align-middle">
        <div className="align-center flex flex-row justify-center">
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`amenity-weight-${data.id}`}
            name={`amenity-weight-${data.id}`}
            placeholder="Weight"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <Checkbox
            id={`amenity-isPaid-${data.id}`}
            name={`amenity-isPaid-${data.id}`}
            value="true"
          />
          <span className="font-bold">isPaid</span>
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <Checkbox
            id={`amenity-isUSP-${data.id}`}
            name={`amenity-isUSP-${data.id}`}
            value="true"
          />
          <span className="font-bold">isUSP</span>
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-start gap-5">
          <Button
            className="bg-primary-500 aspect-square p-2"
            onClick={() => removeAmenity(data.id)}
          >
            <HiMinus className="" />
          </Button>
          {showPlusButton && (
            <Button
              className="bg-primary-500 aspect-square p-2"
              onClick={createAmenity}
            >
              <HiPlus />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function ActivityRow({
  activityOptions,
  data,
  showPlusButton,
  createActivity,
  removeActivity,
  className,
}: {
  data: ActivityData;
  activityOptions: Activity[];
  removeActivity: (id: string) => void;
  createActivity: () => void;
  className?: string;
  showPlusButton: boolean;
}) {
  return (
    <tr className={className}>
      <td className="">
        <Select
          id={`activity-title-${data.id}`}
          name={`activity-title-${data.id}`}
        >
          <option value="">Select Activity</option>
          {activityOptions.map((x) => (
            <option key={x.id} value={x.activity}>
              {x.activity}
            </option>
          ))}
        </Select>
      </td>
      <td className="justify-center align-middle">
        <div className="align-center flex flex-row justify-center">
          <TextInput
            className="max-w-36"
            type="numeric"
            inputMode="numeric"
            id={`activity-weight-${data.id}`}
            name={`activity-weight-${data.id}`}
            placeholder="Weight"
          />
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <Checkbox
            id={`activity-isPaid-${data.id}`}
            name={`activity-isPaid-${data.id}`}
            value="true"
          />
          <span className="font-bold">isPaid</span>
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <Checkbox
            id={`activity-isUSP-${data.id}`}
            name={`activity-isSUSP-${data.id}`}
            value="true"
          />
          <span className="font-bold">isUSP</span>
        </div>
      </td>
      <td className="align-center justify-center">
        <div className="flex flex-row items-center gap-5">
          <Button
            className="bg-primary-500 aspect-square p-2"
            onClick={() => removeActivity(data.id)}
          >
            <HiMinus className="" />
          </Button>
          {showPlusButton && (
            <Button
              className="bg-primary-500 aspect-square p-2"
              onClick={createActivity}
            >
              <HiPlus />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
