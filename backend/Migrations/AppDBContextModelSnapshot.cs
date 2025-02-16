﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using qrmanagement.backend.Context;

#nullable disable

namespace qrmanagement.backend.Migrations
{
    [DbContext(typeof(AppDBContext))]
    partial class AppDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("qrmanagement.backend.Models.Asset", b =>
                {
                    b.Property<string>("id")
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("assetType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("imagePath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("itemStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("locationId")
                        .HasColumnType("int");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.HasIndex("locationId");

                    b.ToTable("Assets");

                    b.HasData(
                        new
                        {
                            id = "AN-001-070225",
                            assetType = "Electronics",
                            imagePath = "",
                            itemStatus = "Active",
                            locationId = 2,
                            name = "Samsung_Galaxy"
                        },
                        new
                        {
                            id = "AN-002-070225",
                            assetType = "Electronics",
                            imagePath = "",
                            itemStatus = "Active",
                            locationId = 1,
                            name = "Samsung_Flip"
                        });
                });

            modelBuilder.Entity("qrmanagement.backend.Models.AssetMove", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<string>("assetNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("moveStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ticketNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(13)");

                    b.HasKey("id");

                    b.HasIndex("assetNumber");

                    b.HasIndex("ticketNumber");

                    b.ToTable("AssetMoves");

                    b.HasData(
                        new
                        {
                            id = 1,
                            assetNumber = "AN-001-070225",
                            moveStatus = "Completed",
                            ticketNumber = "TN-001-070225"
                        },
                        new
                        {
                            id = 2,
                            assetNumber = "AN-002-070225",
                            moveStatus = "Completed",
                            ticketNumber = "TN-002-070225"
                        });
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Branch", b =>
                {
                    b.Property<int>("branchId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("branchId"));

                    b.Property<string>("branchEmail")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("branchId1")
                        .HasColumnType("int");

                    b.Property<string>("branchLocation")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("branchName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("branchPhone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("parentId")
                        .HasColumnType("int");

                    b.HasKey("branchId");

                    b.HasIndex("branchId1");

                    b.ToTable("Branches");

                    b.HasData(
                        new
                        {
                            branchId = 1,
                            branchEmail = "astraInternational@ai.astra.co.id",
                            branchLocation = "Jakarta Utara",
                            branchName = "Astra International",
                            branchPhone = "1234567890123",
                            parentId = 0
                        },
                        new
                        {
                            branchId = 2,
                            branchEmail = "ag.it@ai.astra.co.id",
                            branchLocation = "Jakarta Selatan",
                            branchName = "Astragraphia Information Technology",
                            branchPhone = "1234567890321",
                            parentId = 1
                        });
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Ticket", b =>
                {
                    b.Property<string>("ticketNumber")
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("approvalStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("branchDestination")
                        .HasColumnType("int");

                    b.Property<int>("branchOrigin")
                        .HasColumnType("int");

                    b.Property<DateOnly>("dateRequested")
                        .HasColumnType("date");

                    b.Property<DateOnly>("inboundDate")
                        .HasColumnType("date");

                    b.Property<string>("moveStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateOnly>("outboundDate")
                        .HasColumnType("date");

                    b.Property<int>("quantity")
                        .HasColumnType("int");

                    b.HasKey("ticketNumber");

                    b.HasIndex("branchDestination");

                    b.HasIndex("branchOrigin");

                    b.ToTable("Tickets");

                    b.HasData(
                        new
                        {
                            ticketNumber = "TN-001-070225",
                            approvalStatus = "Approved",
                            branchDestination = 2,
                            branchOrigin = 1,
                            dateRequested = new DateOnly(2025, 1, 28),
                            inboundDate = new DateOnly(2025, 2, 5),
                            moveStatus = "Completed",
                            outboundDate = new DateOnly(2025, 2, 1),
                            quantity = 1
                        },
                        new
                        {
                            ticketNumber = "TN-002-070225",
                            approvalStatus = "Approved",
                            branchDestination = 1,
                            branchOrigin = 2,
                            dateRequested = new DateOnly(2025, 1, 28),
                            inboundDate = new DateOnly(2025, 2, 5),
                            moveStatus = "Completed",
                            outboundDate = new DateOnly(2025, 2, 1),
                            quantity = 1
                        });
                });

            modelBuilder.Entity("qrmanagement.backend.Models.User", b =>
                {
                    b.Property<int>("userId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("userId"));

                    b.Property<string>("password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("userBranch")
                        .HasColumnType("int");

                    b.Property<string>("userEmail")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("userName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("userPhone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("userRole")
                        .HasColumnType("int");

                    b.Property<int>("userSubRole")
                        .HasColumnType("int");

                    b.HasKey("userId");

                    b.HasIndex("userBranch");

                    b.HasIndex("userEmail")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            userId = 1,
                            password = "12345",
                            userBranch = 1,
                            userEmail = "mgunawan@ai.astra.co.id",
                            userName = "Gunawan",
                            userPhone = "1234567890456",
                            userRole = 1,
                            userSubRole = 0
                        },
                        new
                        {
                            userId = 2,
                            password = "12345",
                            userBranch = 1,
                            userEmail = "gunawan@ai.astra.co.id",
                            userName = "MGunawan",
                            userPhone = "1234567890654",
                            userRole = 1,
                            userSubRole = 1
                        },
                        new
                        {
                            userId = 3,
                            password = "12345",
                            userBranch = 2,
                            userEmail = "aldisar@ai.astra.co.id",
                            userName = "Aldisar",
                            userPhone = "1234567890789",
                            userRole = 0,
                            userSubRole = 0
                        },
                        new
                        {
                            userId = 4,
                            password = "12345",
                            userBranch = 2,
                            userEmail = "gibran@ai.astra.co.id",
                            userName = "Gibran",
                            userPhone = "1234567890987",
                            userRole = 0,
                            userSubRole = 1
                        });
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Asset", b =>
                {
                    b.HasOne("qrmanagement.backend.Models.Branch", "branch")
                        .WithMany("assets")
                        .HasForeignKey("locationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("branch");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.AssetMove", b =>
                {
                    b.HasOne("qrmanagement.backend.Models.Asset", "asset")
                        .WithMany("assetMoves")
                        .HasForeignKey("assetNumber")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("qrmanagement.backend.Models.Ticket", "ticket")
                        .WithMany("assetMoves")
                        .HasForeignKey("ticketNumber")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("asset");

                    b.Navigation("ticket");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Branch", b =>
                {
                    b.HasOne("qrmanagement.backend.Models.Branch", null)
                        .WithMany("branches")
                        .HasForeignKey("branchId1");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Ticket", b =>
                {
                    b.HasOne("qrmanagement.backend.Models.Branch", "destination")
                        .WithMany("inbounds")
                        .HasForeignKey("branchDestination")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("qrmanagement.backend.Models.Branch", "origin")
                        .WithMany("outbounds")
                        .HasForeignKey("branchOrigin")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("destination");

                    b.Navigation("origin");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.User", b =>
                {
                    b.HasOne("qrmanagement.backend.Models.Branch", "branch")
                        .WithMany("users")
                        .HasForeignKey("userBranch")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("branch");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Asset", b =>
                {
                    b.Navigation("assetMoves");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Branch", b =>
                {
                    b.Navigation("assets");

                    b.Navigation("branches");

                    b.Navigation("inbounds");

                    b.Navigation("outbounds");

                    b.Navigation("users");
                });

            modelBuilder.Entity("qrmanagement.backend.Models.Ticket", b =>
                {
                    b.Navigation("assetMoves");
                });
#pragma warning restore 612, 618
        }
    }
}
