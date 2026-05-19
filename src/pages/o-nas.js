import React from "react";
import { graphql } from "gatsby"
import { motion } from "framer-motion";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { OfficialLetterKrzysztofKusza } from "../components/OfficialLetter/OfficialLetterKrzysztofKusza";
import { OfficialLetterAnnaKluzik } from "../components/OfficialLetter/OfficialLetterAnnaKluzik";
import Paragraph from "../components/Paragraph/Paragraph";
import Seo from "../components/seo";

// --- Animacje --- //

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,  
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const separatorVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

// --- Komponent ---

const AboutUs = ({ data }) => {
  return (
    <motion.div
      className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* List Krzysztofa Kuszy */}
      <motion.div variants={fadeInUp}>
        <OfficialLetterKrzysztofKusza />
      </motion.div>

      {/* Separator */}
      <motion.div
        className="my-20 border-t border-gray-200 dark:border-gray-800 origin-center"
        variants={separatorVariants}
      />

      {/* List Anny Kluzik */}
      <motion.div variants={fadeInUp}>
        <OfficialLetterAnnaKluzik />
      </motion.div>

      {/* Separator */}
      <motion.div
        className="my-20 border-t border-gray-200 dark:border-gray-800 origin-center"
        variants={separatorVariants}
      />

      {/* Paragrafy z CMS */}
      <motion.div variants={staggerContainer}>
        {data.allDatoCmsAboutCompany.nodes[0].paragraph.map((para, index) => {
          const isFullWidth = index === 2;
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              className={`mb-16
                ${isFullWidth
                  ? "flex flex-col gap-6 items-center"
                  : "grid gap-6 lg:gap-10 items-center md:grid-cols-2"
                }
              `}
              variants={fadeInUp}
              viewport={{ once: true, margin: "-80px" }}
              initial="hidden"
              whileInView="visible"
            >
              {/* Obrazek */}
              {para.picture && (
                <motion.div
                  className={`
                    ${isFullWidth
                      ? "w-full order-1"
                      : isEven
                        ? "md:order-2 flex justify-center"
                        : "md:order-1 flex justify-center"
                    }
                  `}
                  variants={isEven ? slideInRight : slideInLeft}
                  viewport={{ once: true, margin: "-60px" }}
                  initial="hidden"
                  whileInView="visible"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GatsbyImage
                      image={getImage(para.picture)}
                      className={`
                        rounded-xl shadow-lg
                        ${isFullWidth
                          ? "w-full max-h-[500px] object-cover"
                          : "w-full max-w-md object-cover"
                        }
                      `}
                      alt={para.picture.alt || "Zdjęcie"}
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Tekst */}
              <motion.div
                className={`
                  ${isFullWidth
                    ? "order-2 w-full"
                    : isEven
                      ? "md:order-1"
                      : "md:order-2"
                  }
                `}
                variants={isEven ? slideInLeft : slideInRight}
                viewport={{ once: true, margin: "-60px" }}
                initial="hidden"
                whileInView="visible"
              >
                <Paragraph
                  firstLetter
                  className="text-base leading-7 text-gray-700 dark:text-gray-300"
                >
                  {para.description}
                </Paragraph>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export const query = graphql`
  query DatoCMSQuery {
    allDatoCmsAboutCompany {
      nodes {
        paragraph {
          description
          picture {
            alt
            gatsbyImageData(width: 800)
          }
        }
      }
    }
  }
`
export const Head = () => <Seo title="O nas" />
export default AboutUs