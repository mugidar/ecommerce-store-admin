"use client";
import { Color } from "@prisma/client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AlertModal from "@/components/modals/allert-modal";
import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { HexColorPicker } from "react-colorful";
interface ColorFormProps {
  initialData: Color | null;
}
const formSchema = z.object({
  name: z.string(),
  value: z.string(),
});
type ColorFormValues = z.infer<typeof formSchema>;

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const origin = useOrigin();
  const [isOpen, setIsOpen] = useState(false);
  const { storeId, colorId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("#000000");
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });
  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit color" : "Add a new color";
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save changes" : "Create";

  const router = useRouter();
  const onSubmit = async (values: ColorFormValues) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(`/api/${storeId}/colors/${colorId}`, values);
      } else {
        await axios.post(`/api/${storeId}/colors`, values);
        form.reset();
      }

      toast.success(toastMessage);
      router.refresh();
    } catch (error) {
      toast.error("Error.");
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      form.reset();
      toast.success("Deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Existing colors are left.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onConfirm={onDelete}
        onClose={() => setIsOpen(false)}
        isLoading={isLoading}
      />
      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button onClick={() => setIsOpen(true)} variant={"destructive"}>
            <Trash2 />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="flex flex-col mt-5 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="w-20 h-20">
                  <FormLabel>Value</FormLabel>
                  <FormMessage />
                  <FormControl>
                    {/*  <Input
                      disabled={isLoading}
                      placeholder="Color value"
                      {...field}
                    /> */}
                    <div className="flex items-center gap-5">
                      <span>
                        <Input
                          type="color"
                          color={color}
                          defaultValue={color}
                          className="w-16 h-16"     
                          {...field}
                        />
                      </span>
                      <div
                        className="border-2 border-black text-white shadow-2xl shadow-current p-5 h-10 flex items-center rounded-xl"
                        style={{ backgroundColor: `${field.value || color}` }}
                      >
                        {field.value || color}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />{" "}
          </div>
          <Button
            disabled={isLoading}
            className="self-start mt-44"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      {/* <ApiAlert title="TTT" description={`${origin}/api/${storeId}`} /> */}
    </>
  );
};

export default ColorForm;
