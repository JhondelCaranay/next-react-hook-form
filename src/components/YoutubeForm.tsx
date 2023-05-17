import { useForm, SubmitHandler, FieldErrors, useFieldArray } from "react-hook-form";
import React, { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
const DevT = dynamic(() => import("@hookform/devtools").then((module) => module.DevTool), {
  ssr: false,
});

type Inputs = {
  username: string;
  email: string;
  channel: string;
  age: number;
  dob: Date | string;
  gender: any;
  address: {
    line1: string;
    line2: string;
  };
  phone: {
    number: string;
  }[];
};

export const YouTubeForm = () => {
  const defaultvalue = useCallback(async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const data = await response.json();
    console.log(data);

    return {
      username: "Batman",
      email: data.email,
      channel: "",
      age: 26,
      dob: new Date(),
      gender: "male",
      address: {
        line1: "",
        line2: "",
      },
      // dob: new Date(),
      phone: [{ number: "" }],
    };
  }, []);

  // const defaultValue2 = async () => {
  //   const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  //   const data = await response.json();
  //   console.log(data);

  //   return {
  //     username: "Batman",
  //     email: data.email,
  //     channel: "",
  //     age: 26,
  //     gender: "male",
  //     address: {
  //       line1: "",
  //       line2: "",
  //     },
  //     // dob: new Date(),
  //     // phone: [{ number: "" }],
  //   };
  // };

  const initialValues: Inputs | undefined = {
    username: "del",
    email: "del@gmail.com",
    channel: "ulols",
    age: 26,
    // dob: new Date(),
    // dob: new Date("2023-05-17"),
    dob: "",
    gender: "male",
    address: {
      line1: "malolos",
      line2: "calumpit",
    },
    phone: [{ number: "123" }],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitSuccessful, isDirty, isValid, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: initialValues,
    // explain validation mode: https://www.youtube.com/watch?v=4euAxX6K93A&list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s&index=27
    mode: "onTouched", //default is onSumbit
  });

  const { fields, append, remove } = useFieldArray({
    name: "phone",
    control,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("valid data", data);
  };

  const onError = (errors: FieldErrors<Inputs>) => {
    console.log("Form errors", errors);
  };

  const onReset = () => {
    reset();
  };

  const handleGetValues = () => {
    console.log("Get values", getValues(["username", "email"]));
    console.log("Get values", getValues("username"));
  };

  const handleSetValue = (value: string) => {
    setValue("username", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  // console.log(watch()); // watch input value by passing the name of it
  // console.log(errors.gender?.message);

  // const watchUsername = watch("username");
  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) =>
  //     console.log(value, name, type)
  //   );
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="w-1/2 flex flex-col justify-center items-center bg-slate-700 rounded-md shadow-md p-10">
      <h1 className="text-3xl font-bold text-center mb-4">YouTube Form</h1>
      <pre
        // vscode theme
        className="w-full bg-gray-800 rounded-md p-4 mb-4 text-white"
      >
        <code
          // vscode theme
          className="text-sm"
        >
          {JSON.stringify(watch(), null, 2)}
        </code>
      </pre>

      <form
        className="w-full flex flex-col justify-center"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <div className="w-full flex flex-col mb-1">
          <label htmlFor="username" className="text-sm font-semibold mb-1">
            Username
          </label>
          <input
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
            type="text"
            id="username"
            {...register("username", {
              required: { message: "username is required ulol ka", value: true },
            })}
          />
          <span className={`text-red-400 text-xs ${errors.username ? "visible" : "invisible"}`}>
            {errors.username?.message || "username is required"}
          </span>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="email" className="text-sm font-semibold mb-1">
            E-mail
          </label>
          <input
            className="border-2 border-gray-400 rounded-md px-2 py-1 mb-2 text-black"
            type="email"
            id="email"
            {...register("email", {
              required: { message: "email is required", value: true },
              pattern: {
                message: "invalid email",
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              },
              validate: {
                notAdmin: (value) => {
                  return value !== "admin@example.com" || "Enter a different email address";
                },
                notBlackListed: (fieldValue) => {
                  return !fieldValue.endsWith("baddomain.com") || "This domain is not supported";
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length === 0 || "Email already exists";
                },
              },
            })}
          />
          <span className={`text-red-400 text-xs ${errors.email ? "visible" : "invisible"}`}>
            {errors.email?.message || "email is required"}
          </span>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="channel" className="text-sm font-semibold mb-1">
            Channel
          </label>
          <input
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
            type="text"
            id="channel"
            {...register("channel", {
              required: { message: "channel is required", value: true },
            })}
          />
          <span className={`text-red-400 text-xs ${errors.channel ? "visible" : "invisible"}`}>
            {errors.channel?.message || "channel is required"}
          </span>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="gender" className="text-sm font-semibold mb-1">
            gender
          </label>
          <select
            id="gender"
            {...register("gender", { required: { message: "gender is required", value: true } })}
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
            onChange={(e) => {
              if (e.target.value === "other") {
                handleSetValue("");
                setValue("gender", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                return;
              }

              handleSetValue("jhondel");
              setValue("gender", e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          >
            <option value="">select</option>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
          </select>
          <span className={`text-red-400 text-xs ${errors.gender ? "visible" : "invisible"}`}>
            {(errors.gender?.message as string) || "gender is required"}
          </span>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="age" className="text-sm font-semibold mb-1">
            Age
          </label>
          <input
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
            type="number"
            id="age"
            {...register("age", {
              required: { message: "age is required", value: true },
              min: { message: "age must be greater than 18", value: 18 },
              valueAsNumber: true,
            })}
          />
          <span className={`text-red-400 text-xs ${errors.age ? "visible" : "invisible"}`}>
            {errors.age?.message || "age is required"}
          </span>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="dob" className="text-sm font-semibold mb-1">
            Date of Birth
          </label>
          <input
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
            type="date"
            id="dob"
            {...register("dob", {
              required: { value: true, message: "Date of Birth is required" },
              // valueAsDate: true,
            })}
          />
          {/* <p className="error">{errors.dob?.message}</p> */}
          <span className={`text-red-400 text-xs ${errors.dob ? "visible" : "invisible"}`}>
            {errors.dob?.message || "date of birth is required"}
          </span>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="address-line1" className="text-sm font-semibold mb-1">
            Address Line 1
          </label>
          <input
            type="text"
            id="address-line1"
            {...register("address.line1", {
              required: { value: true, message: "Address is required" },
            })}
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
          />
          <p className={`text-red-400 text-xs ${errors.address?.line1 ? "visible" : "invisible"}`}>
            {errors.address?.line1?.message || "Address is required"}
          </p>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label htmlFor="address-line2" className="text-sm font-semibold mb-1">
            Address Line 2
          </label>
          <input
            type="text"
            id="address-line2"
            {...register("address.line2", {
              required: { value: true, message: "Address is required" },
              disabled: watch("address.line1") === "",
            })}
            className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
          />
          <p className={`text-red-400 text-xs ${errors.address?.line2 ? "visible" : "invisible"}`}>
            {errors.address?.line2?.message || "Address is required"}
          </p>
        </div>

        <div className="w-full flex flex-col mb-1">
          <label className="text-sm font-semibold mb-1">List of phone numbers</label>
          <div>
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="flex">
                  <input
                    type="text"
                    {...register(`phone.${index}.number` as const, {
                      required: { value: true, message: "Phone number is required" },
                    })}
                    className="border-2 border-gray-400 rounded-md px-2 py-1 text-black"
                  />

                  {index > 0 && (
                    <button
                      className="border-2 border-red-400 rounded-md px-2 py-1 ml-2  hover:bg-red-400 text-red-400 hover:text-white transition duration-300 ease-in-out"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p
                  className={`text-red-400 text-xs ${
                    errors.phone?.[index]?.number ? "visible" : "invisible"
                  }`}
                >
                  {errors.phone?.[index]?.number?.message || "Phone number is required"}
                </p>
              </div>
            ))}
            <button
              type="button"
              className="w-full border-2 border-gray-400 rounded-md px-2 py-1 mb-2 hover:bg-gray-400 hover:text-black transition duration-300 ease-in-out"
              onClick={() =>
                append({
                  number: "",
                })
              }
            >
              Add phone number
            </button>
          </div>
        </div>

        <button
          disabled={isSubmitting}
          className="w-full border-2 border-gray-400 rounded-md px-2 py-1 mb-2 hover:bg-gray-400 hover:text-black transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Submit <span className="animate-spin inline-block">🌀</span> */}
          {isSubmitting ? (
            <div>
              Submitting <span className="animate-spin inline-block">🌀</span>
            </div>
          ) : (
            <span>Submit</span>
          )}
        </button>
        <button type="button" onClick={handleGetValues}>
          Get values
        </button>
        <button type="button" onClick={() => handleSetValue("jhondel")}>
          Set value
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
        <button type="button" onClick={() => trigger("channel")}>
          Validate channel
        </button>
        <button
          disabled={!isDirty || !isValid}
          className="w-full border-2 border-gray-400 rounded-md px-2 py-1 mb-2 hover:bg-gray-400 hover:text-black transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
      <div>
        {/*// @ts-ignore */}
        <DevT control={control} placement="top-right" />
      </div>
    </div>
  );
};
