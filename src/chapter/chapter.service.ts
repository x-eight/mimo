import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChapter } from './chapter.schema';
import { db } from "../config/app";
import { NewChapter } from './dto/newChapter';
import { UpdateChapter } from './dto/updateChapter';
import { ICourse } from 'src/course/course.schema';
import slugify from 'slugify';
import { CatchId } from './dto/catchId';
import { async } from 'rxjs';

@Injectable()
export class ChapterService {
    private logger = new Logger('ChapterService');
    constructor(
        @InjectModel(db.collChapter)
        private chapterModel: Model<IChapter>,

        @InjectModel(db.collCourse)
        private courseModel: Model<ICourse>,
    ) { }

    async newChapter(
        chapterDto: NewChapter,
    ): Promise<IChapter> {
        const course = await this.courseModel.findById(chapterDto.courseId)
        if (!course) {
            this.logger.verbose(`course dont exist`);
            throw new NotImplementedException(`course dont exist`);
        }
        try {
            chapterDto.slug = course.slug + "/" + slugify(chapterDto.name, { lower: true })
            const chapter = await new this.chapterModel(chapterDto)
            course.chapterId = course.chapterId.concat(chapter.id)
            await course.save()
            await chapter.save()
            return chapter
        } catch (error) {
            this.logger.verbose(`dont create chapter`);
            throw new NotImplementedException(`dont create chapter`);
        }
    }

    async getTotalChapter(
    ): Promise<IChapter[]> {
        return this.chapterModel.find().populate('contentId', 'name')
    }

    async getChapterOfCourse(
        courseId: CatchId,
    ): Promise<IChapter[]> {
        const { id } = courseId
        //let iChapter: IChapter[]
        let iChapter = [];
        const course = await this.courseModel.findById(id)

        for (let index = 0; index < course.chapterId.length; index++) {
            let getCourse = await this.chapterModel.findById(course.chapterId[index]).populate('contentId', 'name video file')
            await iChapter.push(getCourse)
        }
        return iChapter
    }

    async getChapter(
        chapterId: CatchId,
    ): Promise<IChapter> {
        const { id } = chapterId
        const chapter = await this.chapterModel.findById(id).populate('contentId', 'name video file')
        return chapter
    }

    async updateChapter(
        contentId: CatchId,
        chapterDto: UpdateChapter,
    ): Promise<IChapter> {
        const { id } = contentId
        try {
            const chapter = await this.chapterModel.findById(id)
            chapter.name = chapterDto.name
            const slug1 = (chapter.slug).split('/');
            chapter.slug = slug1[0] + "/" + slugify(chapterDto.name, { lower: true })
            chapter.updateAt = new Date()
            return chapter.save()
        } catch (error) {
            this.logger.verbose(`cant update chapter`);
            throw new NotImplementedException(error);
        }
    }

    async deleteChapter(
        id: string,
    ): Promise<IChapter> {
        try {
            const chapter = await this.chapterModel.findById(id)

            if (!chapter) {
                this.logger.verbose(`user with ID "${id}" cant delete`);
                throw new NotImplementedException(`user with ID "${id}" cant delete`);
            }
            await this.chapterModel.deleteOne({ _id: id });
            return chapter;
        } catch (error) {
            this.logger.verbose(`cant delete chapter`);
            throw new NotImplementedException(error);
        }
    }

    async removeChapter(
        id: string,
    ): Promise<IChapter> {
        const chapter = await this.chapterModel.findById(id)
        try {
            await chapter.remove()
            return chapter
        } catch (error) {
            this.logger.verbose(`cant delete chapter`);
            throw new NotImplementedException(error);
        }
    }

}
