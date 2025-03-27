using System.Globalization;
using Microsoft.EntityFrameworkCore;
using qrmanagement.backend.Models;

namespace qrmanagement.backend.Context{
    public class AppDBContext : DbContext{
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        { }

        public DbSet<Asset> Assets {get; set;}
        public DbSet<AssetMove> AssetMoves {get; set;}
        public DbSet<Branch> Branches {get; set;}
        public DbSet<Ticket> Tickets {get; set;}
        public DbSet<User> Users {get; set;}
        public DbSet<Kota> Kotas {get; set;}
        public DbSet<Kecamatan> Kecamatans {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Kota>(entity => {
                entity.HasKey(a => a.kotaId);
                
                entity.HasMany(a => a.kecamatans)
                    .WithOne(a => a.kecamatanKota)
                    .HasForeignKey(a => a.kotaId);
                
                entity.HasData(
                    new Kota{kotaId = 1, kotaName = "Jakarta Utara"},
                    new Kota{kotaId = 2, kotaName = "Jakarta Pusat"},
                    new Kota{kotaId = 101, kotaName = "Jakarta Selatan"},
                    new Kota{kotaId = 102, kotaName = "Bandung"},
                    new Kota{kotaId = 103, kotaName = "Surabaya"},
                    new Kota{kotaId = 104, kotaName = "Yogyakarta"},
                    new Kota{kotaId = 105, kotaName = "Medan"}
                );
            });

            modelBuilder.Entity<Kecamatan>(entity => {
                entity.HasKey(a => a.kecamatanId);

                entity.HasOne(a => a.kecamatanKota)
                    .WithMany(a => a.kecamatans)
                    .HasForeignKey(a => a.kotaId);

                entity.HasData(
                    new Kecamatan{kecamatanId = 1, kecamatanName = "Tanjung Priok", kotaId=1},
                    new Kecamatan{kecamatanId = 2, kecamatanName = "Senen", kotaId=2}, 
                    new Kecamatan{kecamatanId = 201, kecamatanName = "Menteng", kotaId = 101},
                    new Kecamatan{kecamatanId = 202, kecamatanName = "Cibiru", kotaId = 102},
                    new Kecamatan{kecamatanId = 203, kecamatanName = "Wonokromo", kotaId = 103},
                    new Kecamatan{kecamatanId = 204, kecamatanName = "Kotagede", kotaId = 104},
                    new Kecamatan{kecamatanId = 205, kecamatanName = "Medan Baru", kotaId = 105}
                );
            });

            modelBuilder.Entity<Branch>(entity => {
                entity.HasKey(a => a.branchId);
                entity.Property(a => a.parentId)
                        .IsRequired(false);

                entity.HasMany(a => a.assets)
                    .WithOne(a => a.branch)
                    .HasForeignKey(a => a.locationId);
                
                entity.HasMany(a => a.users)
                    .WithOne(a => a.branch)
                    .HasForeignKey(a => a.userBranch);

                entity.HasOne(a => a.branchKota)
                    .WithMany(a => a.Branches)
                    .HasForeignKey(a => a.kotaId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(a => a.branchKecamatan)
                    .WithMany(a => a.Branches)
                    .HasForeignKey(a => a.kecamatanId)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasData(
                    new Branch{branchId = 1, branchName = "Astra International", branchEmail = "astraInternational@ai.astra.co.id", branchPhone = "1234567890123", branchLocation = "Jakarta Utara", parentId = null, kecamatanId=1, kotaId=1},
                    new Branch{branchId = 2, branchName = "Astragraphia Information Technology", branchEmail = "ag.it@ai.astra.co.id", branchPhone = "1234567890321", branchLocation = "Jakarta Pusat", parentId = 1, kecamatanId=2, kotaId=2},
                    new Branch{branchId = 3, branchName = "Branch Jakarta", branchEmail = "jakarta@company.com", branchPhone = "+62123456789", branchLocation = "Jl. Sudirman No. 1, Jakarta", parentId = 1, kecamatanId = 201, kotaId = 101 },
                    new Branch{branchId = 4, branchName = "Branch Bandung", branchEmail = "bandung@company.com", branchPhone = "+62223456789", branchLocation = "Jl. Asia Afrika No. 2, Bandung", parentId = 1, kecamatanId = 202,  kotaId = 102},
                    new Branch{branchId = 5, branchName = "Branch Surabaya", branchEmail = "surabaya@company.com", branchPhone = "+62313456789", branchLocation = "Jl. Tunjungan No. 3, Surabaya", parentId = null, kecamatanId = 203, kotaId = 103},
                    new Branch{branchId = 6, branchName = "Branch Yogyakarta", branchEmail = "yogyakarta@company.com", branchPhone = "+62274567890", branchLocation = "Jl. Malioboro No. 4, Yogyakarta", parentId = 5, kecamatanId = 204, kotaId = 104},
                    new Branch{branchId = 7, branchName = "Branch Medan", branchEmail = "medan@company.com", branchPhone = "+62613456789", branchLocation = "Jl. Gatot Subroto No. 5, Medan", parentId = null, kecamatanId = 205, kotaId = 105}
                );
            });

            modelBuilder.Entity<Asset>(entity => {
                entity.HasKey(a => a.id);
                entity.Property(a => a.assetType)
                        .HasConversion<string>();
                entity.Property(a => a.itemStatus)
                        .HasConversion<string>();

                entity.HasMany(a => a.assetMoves)
                    .WithOne(a => a.asset)
                    .HasForeignKey(a => a.assetNumber);

                entity.HasOne(a => a.branch)
                    .WithMany(a => a.assets)
                    .HasForeignKey(a => a.locationId);

                entity.HasData(
                    new Asset{id = "AN-001-070225", name = "Samsung_Galaxy", locationId = 2, assetType = assetType.Electronics, itemStatus = managementStatus.Active, imagePath = ""},
                    new Asset{id = "AN-002-070225", name = "Samsung_Flip", locationId = 1, assetType = assetType.Electronics, itemStatus = managementStatus.Active, imagePath = ""}
                    // new Asset{id = "AN-202-", name = "Laptop Dell XPS 15", locationId = 1, assetType = assetType.Electronics, itemStatus = managementStatus.Active, imagePath = ""},
                    // new Asset{id = "AST-20240300002", name = "Kursi Ergonomis", locationId = 2, assetType = assetType.Furniture, itemStatus = managementStatus.InActive, imagePath = ""},
                    // new Asset{id = "AST-20240300003", name = "Mobil Operasional Toyota Avanza", locationId = 3, assetType = assetType.Vehicles, itemStatus = managementStatus.Active, imagePath = ""},
                    // new Asset{id = "AST-20240300004", name = "Gudang Penyimpanan", locationId = 4, assetType = assetType.Real_Estate, itemStatus = managementStatus.Missing, imagePath = ""},
                    // new Asset{id = "AST-20240300005", name = "Printer HP LaserJet", locationId = 5, assetType = assetType.Office_Equipment, itemStatus = managementStatus.Active, imagePath = "/images/assets/printer_hp.jpg"}
                );
            });

            modelBuilder.Entity<Ticket>(entity => {
                entity.HasKey(a => a.ticketNumber);
                entity.Property(a => a.approvalStatus)
                        .HasConversion<string>();
                entity.Property(a => a.moveStatus)
                        .HasConversion<string>();

                entity.HasMany(a => a.assetMoves)
                    .WithOne(a => a.ticket)
                    .HasForeignKey(a => a.ticketNumber);

                entity.HasOne(t => t.origin)
                    .WithMany(b => b.outbounds)
                    .HasForeignKey(t => t.branchOrigin)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(t => t.destination)
                    .WithMany(b => b.inbounds)
                    .HasForeignKey(t => t.branchDestination)
                    .OnDelete(DeleteBehavior.NoAction); 
                
                entity.HasData(
                    new Ticket{ticketNumber = "TN-001-070225", branchOrigin = 1, branchDestination = 2, requestedBy = 2, receivedBy = 1, outboundDate = DateOnly.ParseExact("01-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), inboundDate = DateOnly.ParseExact("05-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), dateRequested = DateOnly.ParseExact("28-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture), approvalStatus = approvalStatus.Approved, moveStatus = ticketMoveStatus.Completed, dateApproved = DateOnly.ParseExact("30-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture)},
                    new Ticket{ticketNumber = "TN-002-070225", branchOrigin = 2, branchDestination = 1, requestedBy = 1, receivedBy = 2, outboundDate = DateOnly.ParseExact("01-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), inboundDate = DateOnly.ParseExact("05-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), dateRequested = DateOnly.ParseExact("28-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture), approvalStatus = approvalStatus.Approved, moveStatus = ticketMoveStatus.Completed, dateApproved = DateOnly.ParseExact("30-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture)},
                    new Ticket{ticketNumber = "TN-003-070225", branchOrigin = 2, branchDestination = 1, requestedBy = 1, receivedBy = 2, outboundDate = new DateOnly(2025, 3, 1),inboundDate = new DateOnly(2025, 3, 3),dateRequested = new DateOnly(2025, 2, 25),dateApproved = new DateOnly(2025, 2, 26),approvalStatus = approvalStatus.Approved,moveStatus = ticketMoveStatus.Completed},
                    new Ticket{ticketNumber = "TN-004-070225", branchOrigin = 1, branchDestination = 2, requestedBy = 2, receivedBy = 1, outboundDate = new DateOnly(2025, 3, 5),inboundDate = null,dateRequested = new DateOnly(2025, 2, 28),dateApproved = null,approvalStatus = approvalStatus.Pending,moveStatus = ticketMoveStatus.Not_Started},
                    new Ticket{ticketNumber = "TN-005-070225", branchOrigin = 2, branchDestination = 3, requestedBy = 3, receivedBy = 2, outboundDate = new DateOnly(2025, 3, 10),inboundDate = new DateOnly(2025, 3, 12),dateRequested = new DateOnly(2025, 3, 5),dateApproved = new DateOnly(2025, 3, 6),approvalStatus = approvalStatus.Approved,moveStatus = ticketMoveStatus.Completed},
                    new Ticket{ticketNumber = "TN-006-070225", branchOrigin = 1, branchDestination = 3, requestedBy = 3, receivedBy = 1, outboundDate = null,inboundDate = null,dateRequested = new DateOnly(2025, 3, 8),dateApproved = null,approvalStatus = approvalStatus.Draft,moveStatus = ticketMoveStatus.Not_Started},
                    new Ticket{ticketNumber = "TN-007-070225", branchOrigin = 1, branchDestination = 3, requestedBy = 1, receivedBy = 3, outboundDate = null,inboundDate = null,reason = "Unit rusak",dateRequested = new DateOnly(2025, 3, 8),dateApproved = null,approvalStatus = approvalStatus.Rejected,moveStatus = ticketMoveStatus.Not_Started},
                    new Ticket{ticketNumber = "TN-008-070225", branchOrigin = 3, branchDestination = 1, requestedBy = 3, receivedBy = 1, outboundDate = new DateOnly(2025, 3, 15), inboundDate = null, dateRequested = new DateOnly(2025, 3, 10),dateApproved = new DateOnly(2025, 3, 11),approvalStatus = approvalStatus.Approved,moveStatus = ticketMoveStatus.In_Progress}
                );
            });

            modelBuilder.Entity<AssetMove>(entity => {
                entity.HasKey(a => a.id);
                entity.Property(a => a.moveStatus)
                        .HasConversion<string>();

                entity.HasOne(a => a.asset)
                    .WithMany(a => a.assetMoves)
                    .HasForeignKey(a => a.assetNumber);

                entity.HasOne(a => a.ticket)
                    .WithMany(a => a.assetMoves)
                    .HasForeignKey(a => a.ticketNumber);

                entity.HasData(
                    new AssetMove{id = 1, ticketNumber = "TN-001-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Arrived},
                    new AssetMove{id = 2, ticketNumber = "TN-002-070225", assetNumber = "AN-002-070225", moveStatus = AssetMoveStatus.Arrived},
                    new AssetMove{id = 3, ticketNumber = "TN-001-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Arrived },
                    new AssetMove{id = 4, ticketNumber = "TN-001-070225", assetNumber = "AN-002-070225", moveStatus = AssetMoveStatus.Arrived },
                    new AssetMove{id = 5, ticketNumber = "TN-002-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Arrived },
                    new AssetMove{id = 6, ticketNumber = "TN-002-070225", assetNumber = "AN-002-070225", moveStatus = AssetMoveStatus.Arrived },
                    new AssetMove{id = 7, ticketNumber = "TN-003-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Moving },
                    new AssetMove{id = 8, ticketNumber = "TN-004-070225", assetNumber = "AN-002-070225", moveStatus = AssetMoveStatus.Waiting },
                    new AssetMove{id = 9, ticketNumber = "TN-005-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Arrived },
                    new AssetMove{id = 10, ticketNumber = "TN-005-070225", assetNumber = "AN-002-070225", moveStatus = AssetMoveStatus.Missing },
                    new AssetMove{id = 11, ticketNumber = "TN-006-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Draft },
                    new AssetMove{id = 12, ticketNumber = "TN-007-070225", assetNumber = "AN-002-070225", moveStatus = AssetMoveStatus.Draft },
                    new AssetMove{id = 13, ticketNumber = "TN-008-070225", assetNumber = "AN-001-070225", moveStatus = AssetMoveStatus.Moving }
                );
            });

            modelBuilder.Entity<User>(entity => {
                entity.HasKey(a => a.userId);
                entity.HasIndex(a => a.userEmail).IsUnique();

                entity.HasOne(a => a.branch)
                    .WithMany(a => a.users)
                    .HasForeignKey(a => a.userBranch);

                entity.HasData(
                    new User{userId = 1, userName = "Gunawan", userEmail = "mgunawan@ai.astra.co.id", userBranch = 1, userPhone = "1234567890456", userRole = Role.Pusat, userSubRole = SubRole.Kepala_Gudang, password = "12345"},
                    new User{userId = 2, userName = "MGunawan", userEmail = "gunawan@ai.astra.co.id", userBranch = 1, userPhone = "1234567890654", userRole = Role.Pusat, userSubRole = SubRole.PIC_Gudang, password = "12345"},
                    new User{userId = 3, userName = "Aldisar", userEmail = "aldisar@ai.astra.co.id", userBranch = 2, userPhone = "1234567890789", userRole = Role.Cabang, userSubRole = SubRole.Kepala_Gudang, password = "12345"},
                    new User{userId = 4, userName = "Gibran", userEmail = "gibran@ai.astra.co.id", userBranch = 2, userPhone = "1234567890987", userRole = Role.Cabang, userSubRole = SubRole.PIC_Gudang, password = "12345"}
                );
            });
        }
    }
}