import { Column } from 'typeorm';


export class Location {
  @Column({ default: 'سوريا' })
  country: string; //"سوريا,

  @Column({ nullable: true })
  governorate: string; //"محافظة دمشق",

  @Column({ nullable: true })
  city: string; //"بلدية كفر سوسة"

  @Column({ nullable: true })
  quarter: string; //"حي كفر سوسة البلد",

  @Column({ nullable: true })
  street: string; //عبد الله بن حذافة
  //nullable true first time
  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lon: number;

  @Column({
    type: 'geography', // جغرافي يأخذ بعين الاعتبار الانحنائات ويخزن binary
    spatialFeatureType: 'Point', // شكل البيانات: نقطة
    srid: 4326, // ← هنا: تأكد من كتابتها جميعها بحروف صغيرة “srid”
    nullable: true,
  })
  stringPoints: string;
}
