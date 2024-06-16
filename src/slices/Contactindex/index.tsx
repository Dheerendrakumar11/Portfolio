import Bounded from "@/app/components/Bounded";
import Heading from "@/app/components/Heading";
import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import ContentList from './ContentList'
import { createClient } from "@/prismicio";

/**
 * Props for `Contactindex`.
 */
export type ContactindexProps = SliceComponentProps<Content.ContactindexSlice>;

/**
 * Component for "Contactindex" Slices.
 */
const Contactindex = async({ slice }: ContactindexProps): Promise<JSX.Element> => {

const client = createClient()
const blogPosts = await client.getAllByType("blog_post")
const projects = await client.getAllByType("project")


const contentType = slice.primary.contanttype || "Blog"

const items = contentType === "Blog" ? blogPosts : projects;

     
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Heading size="lg" className="mb-8">
        {slice.primary.heading}
      </Heading>
      {isFilled.richText(slice.primary.description) && (
        <div className="prose prose-xl prose-invert mb-8">
          <PrismicRichText field={slice.primary.description} />
        </div>
      )}

<ContentList
        items={items}
        contentType={slice.primary.contanttype}
        viewMoreText={slice.primary.view_more_text}
        fallbackItemImage={slice.primary.fallback_item_image}
      />
    </Bounded>
  );
};

export default Contactindex;
