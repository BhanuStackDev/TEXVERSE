import { motion } from "framer-motion";

export default function WelcomeGreeting({
  greeting,
}) {
  if (!greeting) {
    return null;
  }

  const isNamaste =
    greeting.style ===
    "namaste";

  const isBow =
    greeting.style ===
    "bow";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
      }}
      className="mb-8 text-center"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          rotate: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.1,
        }}
        className="mb-3 flex justify-center"
      >
        <motion.span
          animate={
            isNamaste || isBow
              ? {
                  y: [
                    0,
                    4,
                    0,
                  ],
                  rotateX: [
                    0,
                    8,
                    0,
                  ],
                }
              : {
                  rotate: [
                    0,
                    -10,
                    10,
                    -8,
                    8,
                    0,
                  ],
                  x: [
                    0,
                    -2,
                    2,
                    -2,
                    2,
                    0,
                  ],
                }
          }
          transition={{
            duration:
              isNamaste ||
              isBow
                ? 1.35
                : 1.1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 3.5,
          }}
          className="inline-flex origin-bottom text-5xl sm:text-6xl"
          aria-hidden="true"
        >
          {greeting.emoji}
        </motion.span>
      </motion.div>

      <motion.p
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.3,
        }}
        className="text-xl font-bold text-cyan-300 sm:text-2xl"
      >
        {greeting.primary}
      </motion.p>

      <motion.p
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.42,
        }}
        className="mt-1 text-base font-medium text-white sm:text-lg"
      >
        {greeting.timeGreeting}
      </motion.p>

      <motion.p
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          delay: 0.54,
        }}
        className="mt-2 text-sm text-slate-400"
      >
        {greeting.welcome}
      </motion.p>
    </motion.div>
  );
}