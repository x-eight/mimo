import { Injectable, Logger, NotImplementedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IChapter } from './chapter.schema';
import { db } from "../config/app";
import { NewChapter } from './dto/newChapter';
import { UpdateChapter } from './dto/updateChapter';
import { ICourse } from 'src/course/course.schema';
import slugify from 'slugify';
import { CatchId } from './dto/catchId';
import { IContent } from 'src/content/content.schema';

@Injectable()
export class ChapterService {
    private logger = new Logger('ChapterService');
    constructor(
        @InjectModel(db.collChapter)
        private chapterModel: Model<IChapter>,

        @InjectModel(db.collCourse)
        private courseModel: Model<ICourse>,

        @InjectModel(db.collContent)
        private contentModel: Model<IContent>,
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
        try {
            return this.chapterModel.find().populate('contentId', 'name')
        } catch (error) {
            this.logger.verbose(`get failed with error: ${error}`);
            throw new NotFoundException(`get failed with error: ${error}`)
        }
    }

    async getChapterOfCourse(
        courseId: CatchId,
    ): Promise<IChapter[]> {
        const { id } = courseId
        let iChapter = [];
        try {
            const course = await this.courseModel.findById(id)

            for (let index = 0; index < course.chapterId.length; index++) {
                let getCourse = await this.chapterModel.findById(course.chapterId[index]).populate('contentId', 'name video file')
                await iChapter.push(getCourse)
            }
            return iChapter
        } catch (error) {
            this.logger.verbose(`get failed with error: ${error}`);
            throw new NotFoundException(`get failed with error: ${error}`)
        }
        
    }

    async getChapter(
        chapterId: CatchId,
    ): Promise<IChapter> {
        const { id } = chapterId
        const chapter = await this.chapterModel.findById(id).populate('contentId', 'name video file')
        if (!chapter) {
            this.logger.verbose(`chapter dont exist`);
            throw new NotImplementedException(`chapter dont exist`);
        }
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
        chapterId: CatchId,
    ): Promise<{ delete: string }> {
        let sumContent: number = 0
        const { id } = chapterId
        try {
            const chapter = await this.chapterModel.findById(id);
            const course = await this.courseModel.findById(chapter.courseId);

            course.chapterId = course.chapterId.filter(element => {
                return element != id
            });

            for (let index = 0; index < chapter.contentId.length; index++) {
                let content = await this.contentModel.deleteOne({ _id: chapter.contentId[index] });
                sumContent = sumContent + content.deletedCount
            }

            let result = await this.chapterModel.deleteOne({ _id: id });
            await course.save();
            return { delete: `Deleted ${result.deletedCount} chapter and ${sumContent} content` }
        } catch (error) {
            this.logger.verbose(`Delete failed with error: ${error}`);
            throw new NotFoundException(`Delete failed with error: ${error}`)
        }
    }

}
