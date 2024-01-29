-- CreateTable
CREATE TABLE "Confirm" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "confirmed_code" INTEGER NOT NULL,

    CONSTRAINT "Confirm_pkey" PRIMARY KEY ("id")
);
