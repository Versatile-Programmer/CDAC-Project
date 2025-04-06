-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('SCIENTIST_E', 'SCIENTIST_F');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DRM', 'ARM', 'HOD', 'ED', 'NETOPS', 'WEBMASTER', 'HODHPC');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('YES', 'NO', 'NA');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateTable
CREATE TABLE "User" (
    "emp_no" BIGINT NOT NULL,
    "usr_email" VARCHAR(100) NOT NULL,
    "usr_pass" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "usr_fname" VARCHAR(255) NOT NULL,
    "usr_lname" VARCHAR(255) NOT NULL,
    "centre_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "Centre" (
    "centre_id" SERIAL NOT NULL,
    "cn_name" VARCHAR(40) NOT NULL,
    "netops_red" BIGINT,

    CONSTRAINT "Centre_pkey" PRIMARY KEY ("centre_id")
);

-- CreateTable
CREATE TABLE "GroupDepartment" (
    "dept_id" SERIAL NOT NULL,
    "d_name" VARCHAR(50) NOT NULL,
    "centre_id" INTEGER NOT NULL,

    CONSTRAINT "GroupDepartment_pkey" PRIMARY KEY ("dept_id")
);

-- CreateTable
CREATE TABLE "EdCentreHead" (
    "emp_no" BIGINT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "centre_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EdCentreHead_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "HodList" (
    "emp_no" BIGINT NOT NULL,
    "hod_fname" TEXT NOT NULL,
    "hod_lname" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "centre_id" INTEGER NOT NULL,
    "grp_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HodList_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "DrmList" (
    "emp_no" BIGINT NOT NULL,
    "drm_fname" TEXT NOT NULL,
    "drm_lname" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "desig" "Designation" NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "centre_id" INTEGER NOT NULL,
    "grp_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DrmList_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "ArmList" (
    "emp_no" BIGINT NOT NULL,
    "arm_fname" TEXT NOT NULL,
    "arm_lname" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "desig" "Designation" NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "centre_id" INTEGER NOT NULL,
    "grp_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ArmList_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "HodHpcIandE" (
    "emp_no" BIGINT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HodHpcIandE_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "MemberNetops" (
    "emp_no" BIGINT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "centre_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MemberNetops_pkey" PRIMARY KEY ("emp_no")
);

-- CreateTable
CREATE TABLE "WebMaster" (
    "emp_no" BIGINT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "tele_no" TEXT NOT NULL,
    "mob_no" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "centre_id" INTEGER NOT NULL,

    CONSTRAINT "WebMaster_pkey" PRIMARY KEY ("emp_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emp_no_key" ON "User"("emp_no");

-- CreateIndex
CREATE UNIQUE INDEX "User_usr_email_key" ON "User"("usr_email");

-- CreateIndex
CREATE UNIQUE INDEX "Centre_cn_name_key" ON "Centre"("cn_name");

-- CreateIndex
CREATE UNIQUE INDEX "GroupDepartment_d_name_centre_id_key" ON "GroupDepartment"("d_name", "centre_id");

-- CreateIndex
CREATE UNIQUE INDEX "EdCentreHead_email_id_key" ON "EdCentreHead"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "EdCentreHead_tele_no_key" ON "EdCentreHead"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "EdCentreHead_mob_no_key" ON "EdCentreHead"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "HodList_email_id_key" ON "HodList"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "HodList_tele_no_key" ON "HodList"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "HodList_mob_no_key" ON "HodList"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "HodList_grp_id_key" ON "HodList"("grp_id");

-- CreateIndex
CREATE UNIQUE INDEX "DrmList_email_id_key" ON "DrmList"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "DrmList_tele_no_key" ON "DrmList"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "DrmList_mob_no_key" ON "DrmList"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "ArmList_email_id_key" ON "ArmList"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "ArmList_tele_no_key" ON "ArmList"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "ArmList_mob_no_key" ON "ArmList"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "HodHpcIandE_tele_no_key" ON "HodHpcIandE"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "HodHpcIandE_mob_no_key" ON "HodHpcIandE"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "HodHpcIandE_email_id_key" ON "HodHpcIandE"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "MemberNetops_tele_no_key" ON "MemberNetops"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "MemberNetops_mob_no_key" ON "MemberNetops"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "MemberNetops_email_id_key" ON "MemberNetops"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "MemberNetops_centre_id_key" ON "MemberNetops"("centre_id");

-- CreateIndex
CREATE UNIQUE INDEX "WebMaster_tele_no_key" ON "WebMaster"("tele_no");

-- CreateIndex
CREATE UNIQUE INDEX "WebMaster_mob_no_key" ON "WebMaster"("mob_no");

-- CreateIndex
CREATE UNIQUE INDEX "WebMaster_email_id_key" ON "WebMaster"("email_id");

-- CreateIndex
CREATE UNIQUE INDEX "WebMaster_centre_id_key" ON "WebMaster"("centre_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Centre" ADD CONSTRAINT "Centre_netops_red_fkey" FOREIGN KEY ("netops_red") REFERENCES "MemberNetops"("emp_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupDepartment" ADD CONSTRAINT "GroupDepartment_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EdCentreHead" ADD CONSTRAINT "EdCentreHead_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HodList" ADD CONSTRAINT "HodList_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HodList" ADD CONSTRAINT "HodList_grp_id_fkey" FOREIGN KEY ("grp_id") REFERENCES "GroupDepartment"("dept_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrmList" ADD CONSTRAINT "DrmList_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrmList" ADD CONSTRAINT "DrmList_grp_id_fkey" FOREIGN KEY ("grp_id") REFERENCES "GroupDepartment"("dept_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmList" ADD CONSTRAINT "ArmList_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArmList" ADD CONSTRAINT "ArmList_grp_id_fkey" FOREIGN KEY ("grp_id") REFERENCES "GroupDepartment"("dept_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberNetops" ADD CONSTRAINT "MemberNetops_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebMaster" ADD CONSTRAINT "WebMaster_centre_id_fkey" FOREIGN KEY ("centre_id") REFERENCES "Centre"("centre_id") ON DELETE RESTRICT ON UPDATE CASCADE;
