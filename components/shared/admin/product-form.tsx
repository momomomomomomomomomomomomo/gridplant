'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { createProduct, updateProduct, deleteFile } from '@/lib/actions/product.action';
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validator';
import { ControllerRenderProps, SubmitHandler } from 'react-hook-form';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from 'slugify';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { UploadButton } from '@/lib/uploadthing';

import { Trash, } from 'lucide-react';
import { useState } from 'react';

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  const form = useForm<z.infer<typeof updateProductSchema> | z.infer<typeof insertProductSchema>>({
    resolver: (
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema)
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any,
    defaultValues: product && type === 'Update' ? product : productDefaultValues,
  });
  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  // Handle form submit
  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    // On Update or Create, if successful, delete the removed files
    const processDeletions = async () => {
      if (filesToDelete.length > 0) {
        await Promise.all(filesToDelete.map((url) => deleteFile(url)));
      }
    };

    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message);
      } else {
        await processDeletions();
        toast.success(res.message);
        router.push(`/admin/products`);
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message);
      } else {
        await processDeletions();
        toast.success(res.message);
        router.push(`/admin/products`);
      }
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFilesToDelete((prev) => [...prev, imageToRemove]);
    const newImages = images.filter((image) => image !== imageToRemove);
    form.setValue('images', newImages);
  };

  return (
    <Form {...form}>
      <form method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'>
        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <div className='flex w-full items-center gap-2'>
                  <FormControl>
                    <Input
                      placeholder='Enter product slug'
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    className='bg-gray-500 hover:bg-gray-600'
                    onClick={() => {
                      form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                    }}
                  >
                    Generate
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'category'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Brand */}
          <FormField
            control={form.control}
            name='brand'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'brand'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product brand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Price */}
          <FormField
            control={form.control}
            name='price'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'price'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'stock'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Enter product stock' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string) => (
                        <div key={image} className="relative w-24 h-24">
                          <Image
                            src={image}
                            alt='product image'
                            className='w-full h-full object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                            onClick={() => removeImage(image)}
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Failed to upload image: ${error.message}`);
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className='upload-field'>
          Featured Product
          <Card>
            <CardContent className='space-y-2 mt-2  '>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='space-x-2 items-center'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <div className='relative'>
                  <Image
                    src={banner}
                    alt='banner image'
                    className='w-full object-cover object-center rounded-sm'
                    width={1920}
                    height={680}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={() => {
                      setFilesToDelete((prev) => [...prev, banner]);
                      form.setValue('banner', '');
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Failed to upload image: ${error.message}`);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Description */}
          <FormField
            control={form.control}
            name='description'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'description'
              >;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default ProductForm;
