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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Branch>(entity => {
                entity.HasKey(a => a.branchId);

                entity.HasMany(a => a.assets)
                    .WithOne(a => a.branch)
                    .HasForeignKey(a => a.locationId);
                
                entity.HasMany(a => a.users)
                    .WithOne(a => a.branch)
                    .HasForeignKey(a => a.userBranch);

                entity.HasData(
                    new Branch{branchId = 1, branchName = "Astra International", branchEmail = "astraInternational@ai.astra.co.id", branchPhone = "1234567890123", branchLocation = "Jakarta Utara"},
                    new Branch{branchId = 2, branchName = "Astragraphia Information Technology", branchEmail = "ag.it@ai.astra.co.id", branchPhone = "1234567890321", branchLocation = "Jakarta Selatan", parentId = 1}
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

                entity.HasOne(a => a.origin)
                    .WithMany(a => a.outbounds)
                    .HasForeignKey(a => a.branchOrigin);
                
                entity.HasOne(a => a.destination)
                    .WithMany(a => a.inbounds)
                    .HasForeignKey(a => a.branchDestination);
                
                entity.HasData(
                    new Ticket{ticketNumber = "TN-001-070225", quantity = 1, branchOrigin = 1, branchDestination = 2, outboundDate = DateOnly.ParseExact("01-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), inboundDate = DateOnly.ParseExact("05-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), dateRequested = DateOnly.ParseExact("28-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture), approvalStatus = approvalStatus.Approved, moveStatus = moveStatus.Completed},
                    new Ticket{ticketNumber = "TN-002-070225", quantity = 1, branchOrigin = 2, branchDestination = 1, outboundDate = DateOnly.ParseExact("01-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), inboundDate = DateOnly.ParseExact("05-02-2025", "d-M-yyyy", CultureInfo.InvariantCulture), dateRequested = DateOnly.ParseExact("28-01-2025", "d-M-yyyy", CultureInfo.InvariantCulture), approvalStatus = approvalStatus.Approved, moveStatus = moveStatus.Completed}
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
                    new AssetMove{id = 1, ticketNumber = "TN-001-070225", assetNumber = "AN-001-070225", moveStatus = MoveStatus.Completed},
                    new AssetMove{id = 2, ticketNumber = "TN-002-070225", assetNumber = "AN-002-070225", moveStatus = MoveStatus.Completed}
                );
            });

            modelBuilder.Entity<User>(entity => {
                entity.HasKey(a => a.userId);

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