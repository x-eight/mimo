import { Injectable, Logger, NotImplementedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICourse } from './course.schema';
import { NewCourse } from './dto/newCourse';
import { db } from "../config/app";
import { CatchId } from './dto/catchId';
import { SearchCourse } from './dto/search';
import { UploadCourse } from './dto/uploadCourse';
import { Model } from 'mongoose';
import { MockCourse } from 'mockData/course';
import { commerce, company, lorem } from "faker";
import * as fs from "fs";
import slugify from "slugify";
import { IUsers } from 'src/users/users.schema';
import { IProgress } from 'src/progress/progress.schema';
import { IChapter } from 'src/chapter/chapter.schema';
import { IContent } from 'src/content/content.schema';

@Injectable()
export class CourseService {
    private logger = new Logger('CourseService');
    constructor(
        @InjectModel(db.collCourse)
        private courseModel: Model<ICourse>,

        @InjectModel(db.collUser)
        private userModel: Model<IUsers>,

        @InjectModel(db.collChapter)
        private chapterModel: Model<IChapter>,

        @InjectModel(db.collContent)
        private contentModel: Model<IContent>,

        @InjectModel(db.collProgress)
        private progressModel: Model<IProgress>,
    ) { }

    async newCourse(
        addUserDto: NewCourse,
    ): Promise<ICourse> {
        addUserDto.slug = slugify(addUserDto.title, { lower: true })
        const createdUser = new this.courseModel(addUserDto);
        return createdUser.save();
    }


    async addCourseUser(
        userId: IUsers,
        courseId: CatchId,
    ): Promise<ICourse> {
        const { id } = courseId
        const course = await this.courseModel.findById(courseId.id)
        course.students = course.students + 1

        const user = await this.userModel.findById(userId.id)
        user.courseId = user.courseId.concat(id)

        await user.save()
        await course.save()
        return course
    }


    async mockCourse(
        num: number,
    ) {
        let users = [];
        for (let index = 0; index < num; index++) {
            let generateData: MockCourse = {
                title: commerce.productName(),
                tema: company.companyName(),
                language: lorem.word(),
                description: lorem.words(),
                slug: ""
            }
            generateData.slug = slugify(generateData.title, { lower: true })
            const createdCourse = new this.courseModel(generateData);
            users.push(generateData);
            await createdCourse.save();
        }

        fs.writeFileSync("src/course/dto/data.json", JSON.stringify(users, null, "\t"));

    }

    async getCourse(
        id: string,
    ): Promise<ICourse> {
        const course = await this.courseModel.findById(id)
            .populate({
                path: 'chapterId', select: 'name',
                populate: { path: 'contentId', select: 'name' }
            })
        return course
    }


    async totalCourse(
        searchCourse: SearchCourse,
    ): Promise<ICourse[]> {
        const { search } = searchCourse
        const course = await this.courseModel.find({
            $or: [{ title: new RegExp(search) },
            { tema: new RegExp(search) }]
        }).populate({ path: 'chapterId', select: 'name', })

        if (!course) {
            this.logger.verbose(`course dont exist`);
            throw new NotImplementedException(`course dont exist`);
        }
        return course;

    }


    async getCoursoBySlug(
        slugCourse: string
    ): Promise<ICourse> {
        const course = await this.courseModel.findOne({ slug: slugCourse })
            .populate({
                path: 'chapterId', select: 'name',
                populate: { path: 'contentId', select: 'name' }
            })

        if (!course) {
            this.logger.verbose(`course dont exist`);
            throw new NotImplementedException(`course dont exist`);
        }
        return course;
    }

    async getChapterBySlug(
        slug0: string,
        slug1: string,
    ): Promise<IChapter> {
        const slug = slug0 + "/" + slug1
        const chapter = await this.chapterModel.findOne({ slug: slug })
            .populate({path: 'contentId', select: 'name'})
            
        if (!chapter) {
            this.logger.verbose(`chapter dont exist`);
            throw new NotImplementedException(`chapter dont exist`);
        }
        return chapter;
    }

    async getContentBySlug(
        slug0: string,
        slug1: string,
        slug2: string,
    ): Promise<IContent> {
        const slug = slug0 + "/" + slug1 + "/" + slug2
        const content = await this.contentModel.findOne({ slug: slug })
            
        if (!content) {
            this.logger.verbose(`content dont exist`);
            throw new NotImplementedException(`content dont exist`);
        }
        return content;
    }

    //--------------Course--------------//
    async uploadCourse(
        courseId: CatchId,
        upload: UploadCourse,
    ): Promise<ICourse> {
        const { id } = courseId
        const updates = Object.keys(upload)
        const allowed = ['title', 'tema', 'languaje', 'description']
        const isValid = updates.every((update) => allowed.includes(update))

        if (!isValid) {
            throw new NotImplementedException(`keys invalid!!`);
        }
        const course = await this.courseModel.findById(id);
        if (!course) {
            throw new NotImplementedException('dont exist course!')
        }

        try {
            updates.forEach((update1) => course[update1] = upload[update1])
            course.slug = slugify(course.title, { lower: true })
            course.updateAt = new Date()
            await course.save()
            return course
        } catch (error) {
            throw new NotImplementedException(`Update failed with error: ${error}`)
        }

    }

    async deleteCourse(
        courseId: CatchId,
    ): Promise<{ delete: string }> {
        let sumContent: number = 0
        let sumChapter: number = 0
        const { id } = courseId
        try {
            const course = await this.courseModel.findById(id);

            for (let index = 0; index < course.chapterId.length; index++) {
                let chapter = await this.chapterModel.findById(course.chapterId[index])
    
                for (let index2 = 0; index2 < chapter.contentId.length; index2++) {
                    let Ncontent = await this.contentModel.deleteOne({ _id: chapter.contentId[index2] });
                    sumContent = sumContent + Ncontent.deletedCount
                }
                let Nchapter = await this.chapterModel.deleteOne({ _id: course.chapterId[index] });
                sumChapter = sumChapter + Nchapter.deletedCount
            }

            let result = await this.courseModel.deleteOne({ _id: id });
            return { delete: `Deleted ${result.deletedCount} course and ${sumChapter} chapter and ${sumContent} content` }
        } catch (error) {
            this.logger.verbose(`Delete failed with error: ${error}`);
            throw new NotFoundException(`Delete failed with error: ${error}`)
        }
    }
}
